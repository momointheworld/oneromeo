'use client';
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

interface Breadcrumb {
    href: string;
    text: string;
}

interface BreadcrumbsProps {
    items: Breadcrumb[];
}

const PageBreadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <Breadcrumbs>
            {items.map((item, index) => (
                <BreadcrumbItem key={index} href={item.href}>{item.text}</BreadcrumbItem>
            ))}
        </Breadcrumbs>
    );
};

export default PageBreadcrumbs;
