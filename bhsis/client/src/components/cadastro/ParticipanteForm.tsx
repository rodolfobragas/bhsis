import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const emptyAddress = {
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cep: "",
  cidade: "",
  estado: "",
  pais: "Brasil",
};

const emptyPhone = {
  tipo: "",
  numero: "",
};

const emptyEmail = {
  tipo: "",
  endereco: "",
};

const emptyCustomField = {
  label: "",
  value: "",
};

const initialState = {
  nomeRazao: "",
  nomeFantasia: "",
  grupo: "",
  tipoPessoa: "FISICA",
  cpf: "",
  cnpj: "",
  tipoContribuinte: "",
  ie: "",
  im: "",
  situacao: "ATIVO",
  cargo: "",
  regimeTributario: "",
  dataNascimento: "",
  pisInss: "",
  suframa: "",
  consumidorFinal: false,
  revenda: false,
  estrangeiro: false,
  operadoraCartao: false,
  observacaoInterna: "",
  informacoesAdicionais: "",
  ibs: "",
};

export default function ParticipanteForm() {
  const [principal, setPrincipal] = useState(initialState);
  const [enderecos, setEnderecos] = useState([emptyAddress]);
  const [telefones, setTelefones] = useState([emptyPhone]);
  const [emails, setEmails] = useState([emptyEmail]);
  const [camposExtras, setCamposExtras] = useState([emptyCustomField]);

  const tipoPessoaLabel = useMemo(
    () => (principal.tipoPessoa === "FISICA" ? "Pessoa Física" : "Pessoa Jurídica"),
    [principal.tipoPessoa]
  );

  const updatePrincipal = (key: keyof typeof initialState, value: string | boolean) => {
    setPrincipal((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setPrincipal(initialState);
    setEnderecos([emptyAddress]);
    setTelefones([emptyPhone]);
    setEmails([emptyEmail]);
    setCamposExtras([emptyCustomField]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Participante</CardTitle>
          <CardDescription>
            {"Dados principais do participante. Tipo atual: "}
            <strong>{tipoPessoaLabel}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="text-xs text-muted-foreground">Nome/Razão Social *</label>
              <Input
                className="mt-2"
                value={principal.nomeRazao}
                onChange={(event) => updatePrincipal("nomeRazao", event.target.value)}
                placeholder="Digite o nome ou razão social"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Nome Fantasia</label>
              <Input
                className="mt-2"
                value={principal.nomeFantasia}
                onChange={(event) => updatePrincipal("nomeFantasia", event.target.value)}
                placeholder="Nome fantasia"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Grupo</label>
              <Input
                className="mt-2"
                value={principal.grupo}
                onChange={(event) => updatePrincipal("grupo", event.target.value)}
                placeholder="Grupo do participante"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Tipo *</label>
              <Select
                value={principal.tipoPessoa}
                onValueChange={(value) => updatePrincipal("tipoPessoa", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FISICA">Pessoa Física</SelectItem>
                  <SelectItem value="JURIDICA">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">CPF</label>
              <Input
                className="mt-2"
                value={principal.cpf}
                onChange={(event) => updatePrincipal("cpf", event.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">CNPJ</label>
              <Input
                className="mt-2"
                value={principal.cnpj}
                onChange={(event) => updatePrincipal("cnpj", event.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Tipo Contribuinte</label>
              <Input
                className="mt-2"
                value={principal.tipoContribuinte}
                onChange={(event) => updatePrincipal("tipoContribuinte", event.target.value)}
                placeholder="Ex: ICMS, Simples"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Inscrição Estadual</label>
              <Input
                className="mt-2"
                value={principal.ie}
                onChange={(event) => updatePrincipal("ie", event.target.value)}
                placeholder="Inscrição Estadual"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Inscrição Municipal</label>
              <Input
                className="mt-2"
                value={principal.im}
                onChange={(event) => updatePrincipal("im", event.target.value)}
                placeholder="Inscrição Municipal"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Situação *</label>
              <Select
                value={principal.situacao}
                onValueChange={(value) => updatePrincipal("situacao", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                  <SelectItem value="BLOQUEADO">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Cargo</label>
              <Input
                className="mt-2"
                value={principal.cargo}
                onChange={(event) => updatePrincipal("cargo", event.target.value)}
                placeholder="Cargo ou função"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Regime Tributário</label>
              <Input
                className="mt-2"
                value={principal.regimeTributario}
                onChange={(event) => updatePrincipal("regimeTributario", event.target.value)}
                placeholder="Simples Nacional, Lucro Real..."
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Data de Nascimento</label>
              <Input
                className="mt-2"
                type="date"
                value={principal.dataNascimento}
                onChange={(event) => updatePrincipal("dataNascimento", event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">PIS/INSS</label>
              <Input
                className="mt-2"
                value={principal.pisInss}
                onChange={(event) => updatePrincipal("pisInss", event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">SUFRAMA</label>
              <Input
                className="mt-2"
                value={principal.suframa}
                onChange={(event) => updatePrincipal("suframa", event.target.value)}
              />
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-input px-3 py-2">
              <div>
                <p className="text-sm font-medium">Consumidor final</p>
                <p className="text-xs text-muted-foreground">Marcações fiscais</p>
              </div>
              <Switch
                checked={principal.consumidorFinal}
                onCheckedChange={(checked) => updatePrincipal("consumidorFinal", checked)}
              />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-input px-3 py-2">
              <div>
                <p className="text-sm font-medium">Revenda</p>
                <p className="text-xs text-muted-foreground">Revendedor autorizado</p>
              </div>
              <Switch checked={principal.revenda} onCheckedChange={(checked) => updatePrincipal("revenda", checked)} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-input px-3 py-2">
              <div>
                <p className="text-sm font-medium">Estrangeiro</p>
                <p className="text-xs text-muted-foreground">Participante internacional</p>
              </div>
              <Switch
                checked={principal.estrangeiro}
                onCheckedChange={(checked) => updatePrincipal("estrangeiro", checked)}
              />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-input px-3 py-2">
              <div>
                <p className="text-sm font-medium">Operadora de cartão</p>
                <p className="text-xs text-muted-foreground">Instituição financeira</p>
              </div>
              <Switch
                checked={principal.operadoraCartao}
                onCheckedChange={(checked) => updatePrincipal("operadoraCartao", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereços</CardTitle>
          <CardDescription>Cadastre um ou mais endereços do participante.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {enderecos.map((endereco, index) => (
            <div key={`end-${index}`} className="rounded-lg border border-input p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Endereço {index + 1}</p>
                {enderecos.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEnderecos((prev) => prev.filter((_, idx) => idx !== index))}
                  >
                    Remover
                  </Button>
                )}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Input
                  placeholder="Logradouro"
                  value={endereco.logradouro}
                  onChange={(event) =>
                    setEnderecos((prev) =>
                      prev.map((item, idx) =>
                        idx === index ? { ...item, logradouro: event.target.value } : item
                      )
                    )
                  }
                />
                <Input
                  placeholder="Número"
                  value={endereco.numero}
                  onChange={(event) =>
                    setEnderecos((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, numero: event.target.value } : item))
                    )
                  }
                />
                <Input
                  placeholder="Complemento"
                  value={endereco.complemento}
                  onChange={(event) =>
                    setEnderecos((prev) =>
                      prev.map((item, idx) =>
                        idx === index ? { ...item, complemento: event.target.value } : item
                      )
                    )
                  }
                />
                <Input
                  placeholder="Bairro"
                  value={endereco.bairro}
                  onChange={(event) =>
                    setEnderecos((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, bairro: event.target.value } : item))
                    )
                  }
                />
                <Input
                  placeholder="CEP"
                  value={endereco.cep}
                  onChange={(event) =>
                    setEnderecos((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, cep: event.target.value } : item))
                    )
                  }
                />
                <Input
                  placeholder="Cidade"
                  value={endereco.cidade}
                  onChange={(event) =>
                    setEnderecos((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, cidade: event.target.value } : item))
                    )
                  }
                />
                <Input
                  placeholder="Estado"
                  value={endereco.estado}
                  onChange={(event) =>
                    setEnderecos((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, estado: event.target.value } : item))
                    )
                  }
                />
                <Input
                  placeholder="País"
                  value={endereco.pais}
                  onChange={(event) =>
                    setEnderecos((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, pais: event.target.value } : item))
                    )
                  }
                />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setEnderecos((prev) => [...prev, emptyAddress])}>
            Adicionar endereço
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Telefones</CardTitle>
          <CardDescription>Tipos e números para contato rápido.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {telefones.map((telefone, index) => (
            <div key={`tel-${index}`} className="rounded-lg border border-input p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Telefone {index + 1}</p>
                {telefones.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTelefones((prev) => prev.filter((_, idx) => idx !== index))}
                  >
                    Remover
                  </Button>
                )}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Tipo (Celular, Comercial, etc.)"
                  value={telefone.tipo}
                  onChange={(event) =>
                    setTelefones((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, tipo: event.target.value } : item))
                    )
                  }
                />
                <Input
                  placeholder="Número"
                  value={telefone.numero}
                  onChange={(event) =>
                    setTelefones((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, numero: event.target.value } : item))
                    )
                  }
                />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setTelefones((prev) => [...prev, emptyPhone])}>
            Adicionar telefone
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>E-mails</CardTitle>
          <CardDescription>Endereços eletrônicos associados ao participante.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emails.map((email, index) => (
            <div key={`mail-${index}`} className="rounded-lg border border-input p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">E-mail {index + 1}</p>
                {emails.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEmails((prev) => prev.filter((_, idx) => idx !== index))}
                  >
                    Remover
                  </Button>
                )}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Tipo (Financeiro, Comercial, etc.)"
                  value={email.tipo}
                  onChange={(event) =>
                    setEmails((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, tipo: event.target.value } : item))
                    )
                  }
                />
                <Input
                  placeholder="Endereço de e-mail"
                  value={email.endereco}
                  onChange={(event) =>
                    setEmails((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, endereco: event.target.value } : item))
                    )
                  }
                />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setEmails((prev) => [...prev, emptyEmail])}>
            Adicionar e-mail
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campos adicionais</CardTitle>
          <CardDescription>Informações personalizadas por participante.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {camposExtras.map((campo, index) => (
            <div key={`extra-${index}`} className="rounded-lg border border-input p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Campo {index + 1}</p>
                {camposExtras.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCamposExtras((prev) => prev.filter((_, idx) => idx !== index))}
                  >
                    Remover
                  </Button>
                )}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Título"
                  value={campo.label}
                  onChange={(event) =>
                    setCamposExtras((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, label: event.target.value } : item))
                    )
                  }
                />
                <Input
                  placeholder="Valor"
                  value={campo.value}
                  onChange={(event) =>
                    setCamposExtras((prev) =>
                      prev.map((item, idx) => (idx === index ? { ...item, value: event.target.value } : item))
                    )
                  }
                />
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setCamposExtras((prev) => [...prev, emptyCustomField])}>
            Adicionar campo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observações e informações complementares</CardTitle>
          <CardDescription>Anotações internas e dados extras.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground">Observação interna</label>
            <Textarea
              className="mt-2"
              value={principal.observacaoInterna}
              onChange={(event) => updatePrincipal("observacaoInterna", event.target.value)}
              placeholder="Registre observações internas"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Informações adicionais</label>
            <Textarea
              className="mt-2"
              value={principal.informacoesAdicionais}
              onChange={(event) => updatePrincipal("informacoesAdicionais", event.target.value)}
              placeholder="Complementos do cadastro"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reforma Tributária - IBS</CardTitle>
          <CardDescription>Campos específicos da reforma tributária.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={principal.ibs}
            onChange={(event) => updatePrincipal("ibs", event.target.value)}
            placeholder="Detalhes IBS, regimes e observações"
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={() => {
            resetForm();
            toast.message("Formulário limpo", { description: "Todos os campos foram resetados." });
          }}
        >
          Limpar
        </Button>
        <Button
          onClick={() => {
            toast.success("Cadastro estruturado", {
              description: "Integração de persistência será adicionada na próxima etapa.",
            });
          }}
        >
          Salvar participante
        </Button>
      </div>
    </div>
  );
}
