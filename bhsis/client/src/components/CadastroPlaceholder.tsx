import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CadastroPlaceholderProps = {
  title: string;
  description?: string;
};

export default function CadastroPlaceholder({
  title,
  description,
}: CadastroPlaceholderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Em construção</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Esta seção foi criada como placeholder para o módulo de cadastro.
        </CardContent>
      </Card>
    </div>
  );
}
