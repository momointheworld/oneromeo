const Container = ({
    children,
    className,
    tag: Tag = 'div',
  }: {
    children: React.ReactNode;
    className?: string;
    tag?: keyof JSX.IntrinsicElements;
  }) => {
    return <Tag className={`container ${className}`}>{children}</Tag>;
  };
  
  export default Container;
  