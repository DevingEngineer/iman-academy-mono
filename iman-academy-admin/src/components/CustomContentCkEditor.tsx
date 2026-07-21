'use client';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Link,
  List,
  Heading,
  SourceEditing,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageUpload,
} from 'ckeditor5';
import React from 'react';


interface CustomContentCkEditorProps {
	value: string;
	onChange: (data: string) => void;
}

export default function CustomContentCkEditor({ value, onChange }: CustomContentCkEditorProps) {
	return (
		<div className="prose max-w-none [&_.ck-editor\_\_editable]:min-h-[400px] [&_.ck-editor\_\_editable]:cursor-text">
			<CKEditor
				editor={ClassicEditor}
                
				data={value }
				 onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
                config={{
					licenseKey: 'GPL',
                    plugins: [
                        Essentials,
                        Paragraph,
                        Bold,
                        Italic,
                        Link,
                        List,
                        Heading,
                        SourceEditing,
                        Image,
                        ImageToolbar,
                        ImageCaption,
                        ImageStyle,
                        ImageResize,
                        ImageUpload
                        ],
                    toolbar: [
                            'undo', 'redo', '|',
                            'heading', '|',
                            'bold', 'italic', 'link',
                            'bulletedList', 'numberedList',
                            '|', 'uploadImage',
                            '|', 'sourceEditing'
                        ],
                    image: {
                        toolbar: [
                            'imageStyle:inline',
                            'imageStyle:block',
                            'imageStyle:side',
                            '|',
                            'toggleImageCaption',
                            'imageTextAlternative',
                            '|',
                            'resizeImage',
                        ],
                    },
                        
				}}
			/>
		</div>
	);
}
