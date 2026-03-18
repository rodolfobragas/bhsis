import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useAuthContext } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login: authLogin, isLoading: authLoading } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Use AuthContext login
      const user = await authLogin(data.email, data.password);

      if (data.rememberMe) {
        localStorage.setItem("remember_email", data.email);
      }

      toast.success("Login realizado com sucesso!");
      
      // Redirect based on role
      if (user.role === "admin" || user.role === "manager") {
        setLocation("/admin");
      } else if (user.role === "kitchen") {
        setLocation("/kitchen");
      } else {
        setLocation("/");
      }
    } catch (err) {
      setError("Email ou senha inválidos");
      toast.error("Email ou senha inválidos");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-[5px] mb-4">
            <i className="fa-solid fa-right-to-bracket text-2xl text-primary-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Marmitex System</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Gerenciamento de Restaurante</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Use suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <i className="fa-solid fa-circle-exclamation text-sm" aria-hidden="true" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@email.com"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email?.message as string}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password?.message as string}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                  Lembrar-me neste computador
                </Label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading || authLoading} size="lg">
                {isLoading || authLoading ? "Entrando..." : "Entrar"}
              </Button>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-muted/50 rounded-[5px] border border-border">
                <p className="text-sm font-semibold text-foreground mb-2">Credenciais de demonstração</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <strong>Admin:</strong> admin@marmitex.com / admin123
                  </p>
                  <p>
                    <strong>Cozinha:</strong> kitchen@marmitex.com / kitchen123
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            Sistema de Gerenciamento de Restaurante v1.0 | © 2026 Marmitex
          </p>
        </div>
      </div>
    </div>
  );
}
