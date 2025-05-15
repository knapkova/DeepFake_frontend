
export interface Headline {
    id: number;
    headline: string;
    content: string;
    visible: boolean;
    categoryId: number;
    category?: Category;
}

export interface AssignmentWrongObjectPicture{
    id:number;
    picture:string;
    headline:string;
    alt:string;
    categoryId:number;
    category?:Category;
    comment:string;
}

export interface AssignmentIntroductionArticle{
    id:number;
    title:string;
    content:string;
    Instructions:string;
    imgSrc:string;
    imgae:File;
    visible:boolean;
    categoryId:number;
    questions:StartQuiz[];
}

// manipulative text

export interface AssignmentManipulativeText{
    id:number;
    instructions:string;
    assignmentIntroductionArticleId:number;
    assignmentIntroductionArticle:AssignmentIntroductionArticle;
    text:string;
    header:string;
    manipulativeParts:JSON;
    userFeedback:string;
    visible:boolean;
    categoryId:number;
    manipulativeComments:ManipulativeTextComments[];
    manipulativeMotivations:ManipulativeMotivation[];
}

export interface ManipulativePart {
    startIndex: number;
    endIndex: number;
    reason: string;
}


export interface AssignmentFindPictureSource{
    id:number;
    imgSrc:string;
    image:File;
    imgTitle:string;
    imgDescription:string;
    imgAlt:string;
    visible:boolean;
    categoryId:number;
}

export interface CategoryAssignment{
    categoryId: number,
    orderIndex: number,
    assignmentType: number,
    assignmentId: number,
    id: number
}



// Quiz

export interface QuestionEndQuiz {
    id: number;
    question: string;
    categoryId: number;
    answer: answersEndQuiz[];
}
export interface answersEndQuiz {
    answer: string;
    correct: boolean;
}


export interface AssignmentCognitiveBias{
    id:number;
    cognitiveBias:string;
    definition:string;
    example:string;
    visible:boolean;
    categoryId:number;
}

export interface User{
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface StartQuiz{
    id: number;
    term: string;
    description: string;
    assignmentIntroductionArticleId: number;
}

export interface FunFact{
    id: number;
    title: string;
    text: string;
    categoryId: number;
}

export interface FeedbackMeme{
    id:number;
    description:string;
    imgSrc:string;
}

export interface ManipulativeTextComments{
    id:number;
    comment:string;
    username:string;
    manipulativeMotivationId:number;
    manipulativeMotivation: ManipulativeMotivation;
    manipulativeExplanation:string;
    manipulativeTextId:number;
}

export interface ManipulativeMotivation{
    id:number;
    motivation:string;
    definition:string;
    manipulativeTextId:number;
}
export interface Category{
     id : number,
     name : string,
     description : string,
     visible : boolean,
     duration : number,
     imgSrc : string,
     image : string,
     funFacts : FunFact[],
     feedbackMemes : FeedbackMeme[], 
}