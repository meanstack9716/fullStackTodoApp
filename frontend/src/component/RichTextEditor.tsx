'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
export type RichTextEditorHandle = {
    getContent: () => string;
};

const RichTextEditor = forwardRef<RichTextEditorHandle>((_, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'background': [] }],
                        ['clean'],
                    ],
                },
            });
        }

        return () => {
            quillRef.current = null;
        };
    }, []);

    useImperativeHandle(ref, () => ({
        getContent: () => {
            if (quillRef.current) {
                return quillRef.current.root.innerHTML;
            }
            return '';
        },
    }));

    return <div ref={editorRef} className="border border-gray-300 text-black p-2 min-h-[150px]" />;
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;