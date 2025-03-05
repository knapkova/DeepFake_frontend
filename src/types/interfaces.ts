export interface Category {
    id: number;
    name: string;
    description: string;
    visible: boolean;
    duration: number;
    coverPhoto: string;
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
    instruction:string;
    imgSrc:string;
    imgae:File;
}

// manipulative text

export interface AssignmentManipulativeText{
    id:number;
    text:string;
    header:string;
    manipulativeParts:JSON;
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
    header:string;
    description:string;
    imgAlt:string;
}
