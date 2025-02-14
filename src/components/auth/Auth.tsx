import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GalleryVerticalEnd, Goal } from "lucide-react";
import { useAuthStore } from "@/hooks/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { authSchema } from "@/types/validations/Auth";
import { ServerResponse } from "@/types/utils/ServerResponse";
import { useNavigate } from "react-router-dom";

export function Auth({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const { mutate: authenticateUser, isPending: isAuthenticateUserPending } =
    useMutation({
      mutationFn: async () => {
        return api.auth.loginUser({
          usernameOrEmail: authStore.email,
          password: authStore.password,
        });
      },
      onSuccess: () => {
        navigate("/");
        toast.success("Welcome Back, We Are Delighted To Have You Back");
      },
      onError: (error: AxiosError<ServerResponse>) => {
        toast.error(error?.response?.data?.message);
      },
    });

  const handleAuthSubmit = () => {
    const data = authStore.get();
    const result = authSchema.safeParse(data);
    if (!result.success) {
      authStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      authStore.set("errors", {});
      authenticateUser();
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Kruger Back Office
        </a>
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in using your existing account credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="text"
                      autoComplete="email"
                      disabled={isAuthenticateUserPending}
                      placeholder="m@example.com"
                      value={authStore.email}
                      onChange={(e) => authStore.set("email", e.target.value)}
                    />
                    {authStore?.errors?.email?.[0] && (
                      <span className="text-red-700 text-xs font-semibold">
                        {authStore?.errors?.email?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={isAuthenticateUserPending}
                      value={authStore.password}
                      onChange={(e) =>
                        authStore.set("password", e.target.value)
                      }
                    />
                    {authStore?.errors?.password?.[0] && (
                      <span className="text-red-700 text-xs font-semibold">
                        {authStore?.errors?.password?.[0] || ""}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="w-full flex items-center gap-1"
                      onClick={handleAuthSubmit}
                    >
                      <Goal /> <span>Continue</span>
                    </Button>
                    <Button
                      type="reset"
                      variant={"outline"}
                      className="w-full flex items-center gap-1"
                      onClick={() => authStore.reset()}
                    >
                      <span>Reset</span>
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
