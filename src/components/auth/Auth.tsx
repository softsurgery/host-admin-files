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
import { ArrowRight, GalleryVerticalEnd } from "lucide-react";
import { useAuthStore } from "@/hooks/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";

export function Auth({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const authStore = useAuthStore();

  const { mutate: authenticateUser, isPending: isAuthenticateUserPending } =
    useMutation({
      mutationFn: async () => {
        return api.auth.loginUser({
          username: authStore.email,
          password: authStore.password,
        });
      },
      onSuccess: (data) => {
        console.log("Login successful:", data);
        // Handle success, e.g., redirect or store token
      },
      onError: (error) => {
        console.error("Login failed:", error);
        // Handle error, e.g., show notification
      },
    });

  const handleAuthSubmit = () => {
    authenticateUser();
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
                      disabled={isAuthenticateUserPending}
                      type="text"
                      placeholder="m@example.com"
                      value={authStore.email}
                      onChange={(e) => authStore.set("email", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      disabled={isAuthenticateUserPending}
                      type="password"
                      placeholder="••••••••"
                      autoComplete="off"
                      value={authStore.password}
                      onChange={(e) =>
                        authStore.set("password", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={handleAuthSubmit}
                  >
                    Continue <ArrowRight className="h-6 w-6" />
                  </Button>
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
