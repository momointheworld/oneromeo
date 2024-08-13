const Container = ({
    children,
    className,
    tag: Tag = 'main',
}: {
    children: React.ReactNode
    className?: string
    tag?: keyof JSX.IntrinsicElements
}) => {
    return <Tag className={`prose ${className}`}>{children}</Tag>
}

export default Container
