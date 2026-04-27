import { Input } from "@workspace/ui/components/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface InputPasswordProps extends React.ComponentProps<"input"> {
    showPassword: boolean;
    setShowPassword: (showPassword: boolean) => void;
}

function InputPassword({ className, showPassword, setShowPassword, ...props }: InputPasswordProps) {
    return (
        <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} data-slot="input" className={cn("pr-10", className)} {...props} required />
            <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword?.(!showPassword)}
            >
                {showPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                ) : (
                    <Eye className="size-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                </span>
            </button>
        </div>
    )
}

export default InputPassword;
