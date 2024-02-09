import { NoteTag } from "./notetag.model";

export class Note{
    id: string;
    title: string;
    description: string;
    date: Date;
    notesTags: NoteTag[];
}