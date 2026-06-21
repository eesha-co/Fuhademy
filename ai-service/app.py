"""
Cortex AI - Smart AI Tutor for Nigerian Exams (WAEC/JAMB/NECO)
==============================================================
Uses Qwen2-1.5B-Instruct for intelligent topic recommendations
Fetches topics from Supabase database and makes SMART decisions
"""

import gradio as gr
import json
import os
import re
import requests
import random

print("=" * 60)
print("🧠 Cortex AI - Loading Smart Model...")
print("=" * 60)

from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

SUPABASE_URL = "https://kruwfhzfqieuiuhqlutt.supabase.co"
SUPABASE_KEY = "REDACTED_USE_ENV_VAR"

MODEL_NAME = "Qwen/Qwen2-1.5B-Instruct"

print(f"📥 Loading {MODEL_NAME}...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float32,
    device_map="cpu",
    trust_remote_code=True
)
print("✅ Model loaded!")

def generate(prompt, max_tokens=200):
    try:
        inputs = tokenizer(prompt, return_tensors="pt")
        with torch.no_grad():
            outputs = model.generate(
                inputs.input_ids,
                max_new_tokens=max_tokens,
                temperature=0.7,
                top_p=0.9,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        if prompt in response:
            response = response.replace(prompt, "", 1).strip()
        return response
    except Exception as e:
        print(f"Error: {e}")
        return ""

def get_topics():
    headers = {"Authorization": f"Bearer {SUPABASE_KEY}", "apikey": SUPABASE_KEY}
    try:
        resp = requests.get(f"{SUPABASE_URL}/rest/v1/subject_topics?select=*", headers=headers, timeout=15)
        if resp.status_code == 200:
            return resp.json()
    except Exception as e:
        print(f"Error fetching topics: {e}")
    return []

def get_next_topic(user_id, study_plan, progress, quiz_history):
    subjects = study_plan.get("subjects", ["Mathematics", "Physics", "Chemistry"])
    exam_type = study_plan.get("exam_type", "WAEC")
    completed = progress.get("completed_topics", [])
    
    all_topics = get_topics()
    if not all_topics:
        return {"error": "Could not fetch topics", "ai_generated": False}
    
    # Filter by subjects
    relevant = [t for t in all_topics if any(s.lower() in t.get("subject","").lower() for s in subjects)]
    
    # Remove completed
    completed_set = set(c.lower().replace(" ", "_") for c in completed)
    available = [t for t in relevant if f"{t['subject']}_{t['topic']}".lower().replace(" ", "_") not in completed_set]
    
    if not available:
        available = relevant if relevant else all_topics
    
    # AI picks best topic
    if len(available) > 1:
        topic_names = [t.get("topic", "") for t in available[:8]]
        prompt = f"""You are a {exam_type} exam tutor. Pick the BEST topic for a student.

Available topics: {', '.join(topic_names)}

Consider: foundational topics first, commonly tested topics.

Reply with JSON: {{"chosen": "topic name", "reason": "why"}}"""
        
        ai_response = generate(prompt, 100)
        try:
            match = re.search(r'\{[\s\S]*\}', ai_response)
            if match:
                parsed = json.loads(match.group())
                chosen = parsed.get("chosen", "")
                reason = parsed.get("reason", "")
                for t in available:
                    if chosen.lower() in t.get("topic", "").lower():
                        topic = t
                        break
        except:
            pass
    
    if 'topic' not in dir():
        topic = random.choice(available)
    
    # Build storage URL
    slug = topic['topic'].lower().replace(" ", "-").replace("/", "-")
    subject_slug = topic['subject'].lower().replace(" ", "-")
    storage_url = f"{SUPABASE_URL}/storage/v1/object/public/topics/{subject_slug}/{slug}.html"
    
    return {
        "user_id": user_id,
        "subject": topic.get("subject", "General"),
        "topic": topic.get("topic", "Topic"),
        "category": topic.get("category"),
        "description": topic.get("description", f"Study {topic['topic']}"),
        "difficulty": topic.get("difficulty", "medium"),
        "storage_url": storage_url,
        "action": "study",
        "should_quiz": True,
        "ai_generated": True,
        "reason": f"AI selected this topic for your {exam_type} prep."
    }

def api_get_next_topic(user_id, plan_json, prog_json, hist_json):
    try:
        result = get_next_topic(
            user_id,
            json.loads(plan_json) if plan_json else {},
            json.loads(prog_json) if prog_json else {},
            json.loads(hist_json) if hist_json else []
        )
        return json.dumps(result, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

def api_generate_quiz(subject, topic, exam_type, num_q):
    prompt = f"""Create {num_q} MCQ for {exam_type} - {subject}: {topic}
JSON format: {{"questions":[{{"question":"?","options":["A.","B.","C.","D."],"correct":0}}]}}"""
    response = generate(prompt, 400)
    try:
        match = re.search(r'\{[\s\S]*\}', response)
        if match:
            return match.group()
    except:
        pass
    return '{"questions":[{"question":"Test?","options":["A","B","C","D"],"correct":0}]}'

def api_chat(msg, ctx_json):
    ctx = json.loads(ctx_json) if ctx_json else {}
    return generate(f"As a {ctx.get('exam_type','WAEC')} tutor, answer: {msg}", 150)

with gr.Blocks(title="Cortex AI") as app:
    gr.Markdown("# 🧠 Cortex AI - Smart Tutor\n### WAEC • JAMB • NECO\n**Qwen2-1.5B** makes intelligent recommendations")
    
    with gr.Tab("📚 Get Topic"):
        u = gr.Textbox(label="User ID", value="student")
        p = gr.Textbox(label="Plan", value='{"subjects":["Mathematics","Physics","Chemistry"],"exam_type":"WAEC"}', lines=2)
        pr = gr.Textbox(label="Progress", value='{"completed_topics":[]}')
        qh = gr.Textbox(label="History", value='[]')
        btn = gr.Button("🤖 Get Recommendation")
        out = gr.JSON()
        btn.click(api_get_next_topic, [u, p, pr, qh], out)
    
    with gr.Tab("📝 Quiz"):
        s = gr.Textbox(label="Subject", value="Mathematics")
        t = gr.Textbox(label="Topic", value="Quadratic Equations")
        e = gr.Dropdown(["WAEC","JAMB","NECO"], value="WAEC")
        n = gr.Slider(3, 10, value=5)
        btn2 = gr.Button("Generate")
        out2 = gr.JSON()
        btn2.click(api_generate_quiz, [s, t, e, n], out2)
    
    with gr.Tab("💬 Chat"):
        msg = gr.Textbox(label="Message")
        ctx = gr.Textbox(label="Context", value='{"exam_type":"WAEC"}')
        btn3 = gr.Button("Send")
        out3 = gr.Textbox()
        btn3.click(api_chat, [msg, ctx], out3)

if __name__ == "__main__":
    print("🚀 Cortex AI Ready!")
    app.launch(server_name="0.0.0.0", server_port=7860)
