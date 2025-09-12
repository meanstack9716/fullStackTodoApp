'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export type RichTextEditorHandle = {
    getContent: () => string;
    setContent: (content: string) => void;
};

type Props = {
    value?: string;
};

const RichTextEditor = forwardRef<RichTextEditorHandle, Props>(({ value = "" }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ background: [] }],
                        ['clean'],
                    ],
                },
            });

            if (value) {
                quillRef.current.root.innerHTML = value;
            }
        }
    }, []);

    useEffect(() => {
        if (quillRef.current && value !== undefined) {
            quillRef.current.root.innerHTML = value;
        }
    }, [value]);

    useImperativeHandle(ref, () => ({
        getContent: () => quillRef.current?.root.innerHTML || "",
        setContent: (content: string) => {
            if (quillRef.current) {
                quillRef.current.root.innerHTML = content;
            }
        },
    }));

    return <div ref={editorRef} className="border border-gray-300 text-black p-2 min-h-[150px]" />;
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;
