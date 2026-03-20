import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type CadastroModuleSection = {
  title: string;
  items: string[];
};

type CadastroModuleShellProps = {
  title: string;
  description?: string;
  sections: CadastroModuleSection[];
};

export default function CadastroModuleShell({ title, description, sections }: CadastroModuleShellProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
