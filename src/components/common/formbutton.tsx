import { Button } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

type ButtonColor = "primary" | "default" | "secondary" | "success" | "warning" | "danger";

interface FormButtonProps {
    children: React.ReactNode;
    color?: ButtonColor;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function FormButton({ children, color = "primary", onClick }: FormButtonProps) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { pending } = useFormStatus();

    return (
        <Button type="submit" isLoading={pending} color={color} onClick={onClick}>
            {children}
        </Button>
    );
}
