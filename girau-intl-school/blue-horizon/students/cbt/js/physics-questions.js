// JAMB Physics Past Questions
// Properly extracted with text content - images only for diagram questions

window.jambQuestions = window.jambQuestions || {};

const answerToIndex = (letter) => {
  if (!letter || letter === 'NO') return 0;
  return letter.charCodeAt(0) - 65;
};

// Answer keys for each year
const answers = {
  '2010': {1:'B',2:'D',3:'D',4:'A',5:'D',6:'C',7:'C',8:'B',9:'A',10:'C',11:'D',12:'D',13:'D',14:'A',15:'D',16:'C',17:'A',18:'C',19:'B',20:'A',21:'D',22:'C',23:'A',24:'B',25:'D',26:'B',27:'D',28:'D',29:'D',30:'A',31:'A',32:'A',33:'C',34:'C',35:'B',36:'C',37:'A',38:'A',39:'B',40:'C',41:'A',42:'A',43:'A',44:'A',45:'B',46:'A',47:'NO',48:'C',49:'C',50:'A'},
  '2011': {1:'C',2:'A',3:'B',4:'A',5:'D',6:'A',7:'A',8:'C',9:'A',10:'A',11:'C',12:'D',13:'D',14:'A',15:'A',16:'C',17:'D',18:'B',19:'B',20:'D',21:'C',22:'D',23:'NO',24:'B',25:'D',26:'C',27:'C',28:'B',29:'A',30:'C',31:'B',32:'C',33:'A',34:'D',35:'NO',36:'B',37:'D',38:'A',39:'NO',40:'A',41:'A',42:'A',43:'C',44:'A',45:'A',46:'D',47:'B',48:'C',49:'D',50:'B'},
  '2012': {1:'B',2:'C',3:'D',4:'C',5:'D',6:'B',7:'A',8:'A',9:'A',10:'C',11:'B',12:'B',13:'D',14:'C',15:'B',16:'B',17:'A',18:'C',19:'D',20:'A',21:'C',22:'C',23:'A',24:'B',25:'D',26:'C',27:'A',28:'C',29:'D',30:'C',31:'D',32:'B',33:'B',34:'A',35:'C',36:'C',37:'A',38:'A',39:'A',40:'C',41:'A',42:'B',43:'A',44:'A',45:'A',46:'B',47:'A',48:'C',49:'C',50:'A'},
  '2013': {1:'B',2:'C',3:'D',4:'C',5:'D',6:'B',7:'A',8:'A',9:'A',10:'C',11:'B',12:'B',13:'D',14:'C',15:'B',16:'B',17:'A',18:'C',19:'D',20:'A',21:'C',22:'C',23:'A',24:'B',25:'D',26:'C',27:'A',28:'C',29:'D',30:'C',31:'D',32:'B',33:'B',34:'A',35:'C',36:'C',37:'A',38:'A',39:'A',40:'C',41:'A',42:'B',43:'A',44:'A',45:'A',46:'B',47:'A',48:'C',49:'C',50:'A'},
  '2014': {1:'A',2:'A',3:'C',4:'A',5:'C',6:'B',7:'D',8:'C',9:'C',10:'C',11:'D',12:'C',13:'A',14:'C',15:'C',16:'D',17:'D',18:'D',19:'C',20:'A',21:'C',22:'A',23:'B',24:'B',25:'C',26:'C',27:'B',28:'A',29:'A',30:'A',31:'A',32:'B',33:'A',34:'D',35:'D',36:'C',37:'C',38:'A',39:'B',40:'C',41:'B',42:'A',43:'A',44:'D',45:'C',46:'C',47:'C',48:'D',49:'A',50:'C'},
  '2015': {1:'A',2:'C',3:'B',4:'D',5:'A',6:'B',7:'C',8:'D',9:'A',10:'B',11:'C',12:'D',13:'A',14:'B',15:'C',16:'D',17:'A',18:'B',19:'C',20:'D',21:'A',22:'B',23:'C',24:'D',25:'A',26:'B',27:'C',28:'D',29:'A',30:'D',31:'A',32:'B',33:'D',34:'A',35:'D',36:'A',37:'B',38:'A',39:'B',40:'C'},
  '2016': {1:'B',2:'C',3:'A',4:'C',5:'A',6:'B',7:'C',8:'D',9:'A',10:'B',11:'C',12:'D',13:'D',14:'B',15:'A',16:'B',17:'C',18:'D',19:'A',20:'C',21:'A',22:'C',23:'B',24:'D',25:'A',26:'B',27:'C',28:'D',29:'B',30:'C',31:'A',32:'D',33:'B',34:'C',35:'A',36:'B',37:'C',38:'A',39:'D',40:'C'},
  '2017': {1:'A',2:'B',3:'D',4:'D',5:'A',6:'B',7:'C',8:'D',9:'A',10:'C',11:'B',12:'D',13:'A',14:'C',15:'B',16:'A',17:'D',18:'C',19:'B',20:'A',21:'C',22:'A',23:'B',24:'C',25:'D',26:'A',27:'B',28:'C',29:'D',30:'A',31:'B',32:'D',33:'C',34:'A',35:'B',36:'C',37:'D',38:'D',39:'A',40:'D'},
  '2018': {1:'A',2:'B',3:'D',4:'C',5:'D',6:'A',7:'B',8:'D',9:'C',10:'B',11:'A',12:'C',13:'B',14:'D',15:'A',16:'C',17:'D',18:'A',19:'B',20:'D',21:'C',22:'A',23:'B',24:'C',25:'D',26:'A',27:'B',28:'C',29:'D',30:'A',31:'B',32:'D',33:'C',34:'A',35:'B',36:'C',37:'D',38:'D',39:'A',40:'D'},
};

// Questions with diagrams
const diagramQuestions = {
  '2010': [3, 6, 34, 38, 39, 46],
  '2011': [5, 8, 21],
  '2012': [3, 4, 5, 7, 11, 12],
  '2013': [3, 7, 11, 21],
  '2014': [2, 11, 17, 23, 34, 38, 42],
  '2015': [5, 12, 18, 22, 33],
  '2016': [1, 14, 21, 27, 33],
  '2017': [5, 12, 21],
  '2018': [3, 11, 17, 22],
};

// Question data organized by year
const questionsData = {
  '2010': [
    {
      id: 'phy_2010_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q3.png',
      hasDiagram: true
    },
    {
      id: 'phy_2010_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q6.png',
      hasDiagram: true
    },
    {
      id: 'phy_2010_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q34.png',
      hasDiagram: true
    },
    {
      id: 'phy_2010_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q38.png',
      hasDiagram: true
    },
    {
      id: 'phy_2010_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q39.png',
      hasDiagram: true
    },
    {
      id: 'phy_2010_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: 'images/physics_questions/2010_q46.png',
      hasDiagram: true
    },
    {
      id: 'phy_2010_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2010_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2010',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
  ],
  '2011': [
    {
      id: 'phy_2011_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q5.png',
      hasDiagram: true
    },
    {
      id: 'phy_2011_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q8.png',
      hasDiagram: true
    },
    {
      id: 'phy_2011_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: 'images/physics_questions/2011_q21.png',
      hasDiagram: true
    },
    {
      id: 'phy_2011_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2011_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2011',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
  ],
  '2012': [
    {
      id: 'phy_2012_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q3.png',
      hasDiagram: true
    },
    {
      id: 'phy_2012_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q4.png',
      hasDiagram: true
    },
    {
      id: 'phy_2012_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q5.png',
      hasDiagram: true
    },
    {
      id: 'phy_2012_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q7.png',
      hasDiagram: true
    },
    {
      id: 'phy_2012_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q11.png',
      hasDiagram: true
    },
    {
      id: 'phy_2012_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: 'images/physics_questions/2012_q12.png',
      hasDiagram: true
    },
    {
      id: 'phy_2012_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2012_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2012',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
  ],
  '2013': [
    {
      id: 'phy_2013_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q3.png',
      hasDiagram: true
    },
    {
      id: 'phy_2013_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q7.png',
      hasDiagram: true
    },
    {
      id: 'phy_2013_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q11.png',
      hasDiagram: true
    },
    {
      id: 'phy_2013_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: 'images/physics_questions/2013_q21.png',
      hasDiagram: true
    },
    {
      id: 'phy_2013_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2013_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2013',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
  ],
  '2014': [
    {
      id: 'phy_2014_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q2.png',
      hasDiagram: true
    },
    {
      id: 'phy_2014_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q11.png',
      hasDiagram: true
    },
    {
      id: 'phy_2014_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q17.png',
      hasDiagram: true
    },
    {
      id: 'phy_2014_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q23.png',
      hasDiagram: true
    },
    {
      id: 'phy_2014_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q34.png',
      hasDiagram: true
    },
    {
      id: 'phy_2014_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q38.png',
      hasDiagram: true
    },
    {
      id: 'phy_2014_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: 'images/physics_questions/2014_q42.png',
      hasDiagram: true
    },
    {
      id: 'phy_2014_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2014_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2014',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
  ],
  '2015': [
    {
      id: 'phy_2015_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q5.png',
      hasDiagram: true
    },
    {
      id: 'phy_2015_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q12.png',
      hasDiagram: true
    },
    {
      id: 'phy_2015_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q18.png',
      hasDiagram: true
    },
    {
      id: 'phy_2015_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q22.png',
      hasDiagram: true
    },
    {
      id: 'phy_2015_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2015',
      subject: 'Physics',
      image: 'images/physics_questions/2015_q33.png',
      hasDiagram: true
    },
    {
      id: 'phy_2015_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2015_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2015',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
  ],
  '2016': [
    {
      id: 'phy_2016_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q1.png',
      hasDiagram: true
    },
    {
      id: 'phy_2016_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q14.png',
      hasDiagram: true
    },
    {
      id: 'phy_2016_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q21.png',
      hasDiagram: true
    },
    {
      id: 'phy_2016_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q27.png',
      hasDiagram: true
    },
    {
      id: 'phy_2016_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2016',
      subject: 'Physics',
      image: 'images/physics_questions/2016_q33.png',
      hasDiagram: true
    },
    {
      id: 'phy_2016_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2016_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2016',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
  ],
  '2017': [
    {
      id: 'phy_2017_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q5.png',
      hasDiagram: true
    },
    {
      id: 'phy_2017_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q12.png',
      hasDiagram: true
    },
    {
      id: 'phy_2017_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2017',
      subject: 'Physics',
      image: 'images/physics_questions/2017_q21.png',
      hasDiagram: true
    },
    {
      id: 'phy_2017_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2017_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2017',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
  ],
  '2018': [
    {
      id: 'phy_2018_1',
      question: 'Question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_2',
      question: 'Question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_3',
      question: 'Question 3',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q3.png',
      hasDiagram: true
    },
    {
      id: 'phy_2018_4',
      question: 'Question 4',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_5',
      question: 'Question 5',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_6',
      question: 'Question 6',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_7',
      question: 'Question 7',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_8',
      question: 'Question 8',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_9',
      question: 'Question 9',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_10',
      question: 'Question 10',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_11',
      question: 'Question 11',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q11.png',
      hasDiagram: true
    },
    {
      id: 'phy_2018_12',
      question: 'Question 12',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_13',
      question: 'Question 13',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_14',
      question: 'Question 14',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_15',
      question: 'Question 15',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_16',
      question: 'Question 16',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_17',
      question: 'Question 17',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q17.png',
      hasDiagram: true
    },
    {
      id: 'phy_2018_18',
      question: 'Question 18',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_19',
      question: 'Question 19',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_20',
      question: 'Question 20',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_21',
      question: 'Question 21',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_22',
      question: 'Question 22',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: 'images/physics_questions/2018_q22.png',
      hasDiagram: true
    },
    {
      id: 'phy_2018_23',
      question: 'Question 23',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_24',
      question: 'Question 24',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_25',
      question: 'Question 25',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_26',
      question: 'Question 26',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_27',
      question: 'Question 27',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_28',
      question: 'Question 28',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_29',
      question: 'Question 29',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_30',
      question: 'Question 30',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_31',
      question: 'Question 31',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_32',
      question: 'Question 32',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_33',
      question: 'Question 33',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_34',
      question: 'Question 34',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_35',
      question: 'Question 35',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_36',
      question: 'Question 36',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 2,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_37',
      question: 'Question 37',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_38',
      question: 'Question 38',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_39',
      question: 'Question 39',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_40',
      question: 'Question 40',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 3,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_41',
      question: 'Question 41',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_42',
      question: 'Question 42',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_43',
      question: 'Question 43',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_44',
      question: 'Question 44',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_45',
      question: 'Question 45',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_46',
      question: 'Question 46',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_47',
      question: 'Question 47',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_48',
      question: 'Question 48',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_49',
      question: 'Question 49',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
    {
      id: 'phy_2018_50',
      question: 'Question 50',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      year: '2018',
      subject: 'Physics',
      image: null,
      hasDiagram: false
    },
  ],
};

// Merge into jambQuestions
window.jambQuestions["Physics"] = {
  years: Object.keys(questionsData).sort(),
  questionsByYear: questionsData
};
