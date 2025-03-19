import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import { Gem } from "lucide-react";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authApi.signUp(email, password);
      if (error) throw error;
      navigate("/login");
      toast({
        title: "Registro exitoso",
        description: "Por favor verifica tu correo electrónico para continuar",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: "No se pudo crear la cuenta",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex items-center gap-2">
            <Gem className="h-6 w-6 text-[#008F5D]" />
            <span className="text-xl font-semibold text-[#008F5D]">Zafiro</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Crear cuenta
            </h1>
            <p className="text-gray-500">Ingresa tus datos para registrarte</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 px-4 border-gray-200 focus:border-[#008F5D] focus:ring-[#008F5D]"
            />
          </div>

          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 px-4 border-gray-200 focus:border-[#008F5D] focus:ring-[#008F5D]"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#008F5D] hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Crear cuenta
          </Button>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-[#008F5D] hover:text-emerald-700">
              Iniciar sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
