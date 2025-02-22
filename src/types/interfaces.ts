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
