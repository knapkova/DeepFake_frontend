export interface Category {
    id: number;
    name: string;
    description: string;
    visible: boolean;
    duration: number;
    imgSrc: string;
}

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
}

// manipulative text

export interface AssignmentManipulativeText{
    id:number;
    text:string;
    header:string;
    manipulativeParts:JSON;
    visible:boolean;
    categoryId:number;
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