'use client'
import { createPost } from '@/actions'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TipTap from '@/components/posts/editor'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image'
import Youtube from '@tiptap/extension-youtube'
import { useFormState } from 'react-dom'
import DisplayPostMessage from '@/components/posts/post-message'
import paths from '@/components/paths'
import PageBreadcrumbs from '@/components/common/breadcrumbs'
import FormButton from '@/components/common/formbutton'

interface FormState {
    message: string
    // Other properties related to your form state
}
interface FormDataProps {
    date: Date
    slug: string
    title: string
    categoryNames: string[]
    body: string
}

interface Breadcrumb {
    href: string
    text: string
}

function createSlug(title: string) {
    // Convert title to lowercase
    let slug = title.toLowerCase()
    // Replace spaces with underscores
    slug = slug.replace(/\s+/g, '_')
    // Remove special characters and punctuation marks
    slug = slug.replace(/[^\w-]/g, '')
    // Trim leading and trailing whitespace
    slug = slug.trim()
    return slug
}

export default function CreatePost() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [title, setTitle] = useState('')
    const categories = [
        'About',
        'Privacy',
        'Terms',
        'Blog',
        'FAQ',
        'Quiz',
        'Ebook',
    ]
    const [selectedCategories, setSelectedCategories] = useState<string[]>([
        'Blog',
    ]) // Set default category to 'Work'
    const [formState, action] = useFormState(createPost, { message: '' })
    const formStateMessage = formState.message
    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllPosts(), text: 'Posts' },
        { href: paths.createNewPost(), text: 'New Post' },
    ]

    // Editor config
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Color.configure({
                types: [TextStyle.name, ListItem.name],
            }),
            TextStyle,
            Youtube.configure({
                controls: false,
            }),
            Link.configure({
                openOnClick: false,
                linkOnPaste: true,
                autolink: true,
            }),
            Link.extend({
                inclusive: false,
            }),
            Image.configure({
                inline: true,
            }),
            ImageResize,
        ],
        content: '',
        // onUpdate({ editor }) {
        //     setEditorContent(editor.getHTML());
        //   },
    })
    const editorContent = editor?.getHTML()

    const widthRef = React.useRef<HTMLInputElement>(null)
    const heightRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (widthRef.current && heightRef.current) {
            setWidthAndHeight()
        }
    }, [])

    const setWidthAndHeight = () => {
        widthRef.current!.value = '640'
        heightRef.current!.value = '360'
    }

    const addYoutubeVideo = () => {
        const url = prompt('Enter YouTube URL')

        if (url) {
            const widthValue = widthRef.current?.value
                ? parseInt(widthRef.current.value, 10)
                : null
            const heightValue = heightRef.current?.value
                ? parseInt(heightRef.current.value, 10)
                : null

            const width = Math.max(640, widthValue || 448)
            const height = Math.max(360, heightValue || 336)

            editor?.commands.setYoutubeVideo({
                src: url,
                width,
                height,
            })
        }
    }

    // form input

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target
        setSelectedCategories((prevCategories) =>
            checked
                ? [...prevCategories, value]
                : prevCategories.filter((category) => category !== value)
        )
    }

    const generatedSlug = createSlug(title)
    const formData: FormDataProps = {
        date: selectedDate || new Date(),
        title,
        categoryNames: selectedCategories,
        slug: generatedSlug,
        body: editorContent ?? '',
    }

    return (
        <div>
            <PageBreadcrumbs items={breadcrumbs} />
            {/* formState error message */}
            <DisplayPostMessage formStateMessage={formStateMessage} />
            {/* Form input */}
            <form action={(event) => action(formData)}>
                <h3 className="text-center mb-8">Create a new post</h3>
                <div className="flex flex-col gap-4 p-5">
                    <div className="flex gap-4">
                        <label htmlFor="date" className="w-20">
                            Date
                        </label>
                        <DatePicker
                            id="date"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            className="border rounded p-2 w-full"
                        />
                    </div>

                    <div className="flex gap-4">
                        <label htmlFor="category" className="w-20">
                            Category
                        </label>
                        <div className="flex flex-col">
                            {categories.map((category) => (
                                <div
                                    key={category}
                                    className="flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        id={category}
                                        value={category}
                                        onChange={handleCategoryChange}
                                        checked={selectedCategories.includes(
                                            category
                                        )}
                                    />
                                    <label htmlFor={category} className="ml-2">
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <label htmlFor="title" className="w-20">
                            Title
                        </label>
                        <input
                            className="border rounded p-2 w-full"
                            onChange={(e) => setTitle(e.target.value)}
                            name="title"
                            type="text"
                            id="title"
                        />
                    </div>

                    <div className="container flex gap-4">
                        <span className="w-20">Body</span>
                        <TipTap
                            editor={editor}
                            onYoutubeClick={addYoutubeVideo}
                            widthRef={widthRef}
                            heightRef={heightRef}
                        />
                    </div>
                    <div className="flex gap-4 justify-end">
                        <FormButton>Suhmit</FormButton>
                    </div>
                </div>
            </form>
        </div>
    )
}
