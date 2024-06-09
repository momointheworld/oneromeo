'use client'
import { updatePost, getPost, getAllCategories } from '@/actions'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TipTap from '@/components/posts/editor'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image'
import { useParams } from 'next/navigation'
import { useFormState } from 'react-dom'
import DisplayPostMessage from '@/components/posts/post-message'
import paths from '@/components/paths'
import PageBreadcrumbs from '@/components/common/breadcrumbs'
import FormButton from '@/components/common/formbutton'
import { FullSkeleton } from '@/components/common/skeleton-loading'

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
    id: string
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

export default function UpdatePostPage() {
    const params = useParams()
    const id = params.id?.toString()
    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllPosts(), text: 'Posts' },
        { href: paths.editPost(id), text: 'Edit Post' },
    ]
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [title, setTitle] = useState('')
    const categories = [
        'Home',
        'About',
        'Privacy',
        'Terms',
        'Blog',
        'Thoughts',
        'Work',
        'Hobby',
    ]
    const [selectedCategories, setSelectedCategories] = useState<any[]>([])
    const [editorContent, setEditorContent] = useState('')
    const [formState, action] = useFormState(updatePost, { message: '' })
    const formStateMessage = formState.message

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
            Image,
            ImageResize,
        ],
        content: editorContent,
        // when eidtor body content is changed, editor will be updated
        onUpdate({ editor }) {
            setEditorContent(editor.getHTML())
        },
    })

    useEffect(() => {
        const fetchEditorContent = async () => {
            try {
                const fetchedContent = await getPost({ id })
                setEditorContent(fetchedContent.body) // Extracting and setting body content
                // After setting editor content, initialize the editor
                const fetchedCategories = await getAllCategories()
                // filter the category by the category ID existing
                const filteredCategories = fetchedCategories.filter(
                    (category) =>
                        fetchedContent.categoryIDs.includes(category.id)
                )
                setSelectedCategories(
                    filteredCategories.map((category) => category.name)
                ) // Set the original category hightligted
                setTitle(fetchedContent.title)
                editor?.commands.setContent(fetchedContent.body) // Using body content to set fetched content
            } catch (error) {
                console.error('Error fetching editor content:', error)
            }
        }

        fetchEditorContent()
    }, [editor, id])

    const widthRef = React.useRef<HTMLInputElement>(null)
    const heightRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (widthRef.current && heightRef.current) {
            setWidthAndHeight()
        }
    }, [])

    const setWidthAndHeight = () => {
        widthRef.current!.value = '320'
        heightRef.current!.value = '180'
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

            const width = Math.max(320, widthValue || 448)
            const height = Math.max(180, heightValue || 336)

            editor?.commands.setYoutubeVideo({
                src: url,
                width,
                height,
            })
        }
    }

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
        id: id,
    }

    return (
        <div>
            <PageBreadcrumbs items={breadcrumbs} />
            {/* formState error message */}
            <DisplayPostMessage formStateMessage={formStateMessage} />
            <form action={() => action(formData)}>
                <h3 className="text-center mb-8">Edit Post</h3>
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
                            value={title}
                            name="title"
                            type="text"
                            id="title"
                        />
                    </div>
                    {editorContent === '' ? (
                        <div>
                            <FullSkeleton />
                        </div>
                    ) : (
                        <div className="container flex gap-4">
                            <span className="w-20">Date</span>
                            <TipTap
                                editor={editor}
                                onYoutubeClick={addYoutubeVideo}
                                widthRef={widthRef}
                                heightRef={heightRef}
                            />
                        </div>
                    )}
                    <div className="flex gap-4 justify-end">
                        <FormButton>Update Post</FormButton>
                    </div>
                </div>
            </form>
        </div>
    )
}
