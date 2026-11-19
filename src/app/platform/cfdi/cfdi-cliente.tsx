"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ReceiptTextIcon, SaveIcon } from "lucide-react";
import { sileo } from "sileo";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parsearCfdi } from "@/lib/cfdi/parsear";
import type { Cfdi, ImpuestoDetalle } from "@/lib/cfdi/tipos";

import { guardarCfdi } from "./actions";

export type CfdiGuardado = {
  id: string;
  uuid_fiscal: string | null;
  serie: string | null;
  folio: string | null;
  fecha: string | null;
  tipo_comprobante: string | null;
  moneda: string | null;
  total: number | null;
  emisor_nombre: string | null;
  receptor_nombre: string | null;
  creado_en: string;
};

const MAX_XML = 1024 * 1024;
const MAX_PDF = 5 * 1024 * 1024;

const TIPOS: Record<string, string> = {
  I: "Ingreso",
  E: "Egreso",
  T: "Traslado",
  N: "Nómina",
  P: "Pago",
};

export function CfdiCliente({ cfdis }: { cfdis: CfdiGuardado[] }) {
  const router = useRouter();
  const xmlRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const [datos, setDatos] = useState<Cfdi | null>(null);
  const [xml, setXml] = useState<string | null>(null);
  const [nombreXml, setNombreXml] = useState<string | null>(null);
  const [nombrePdf, setNombrePdf] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const limpiar = () => {
    setDatos(null);
    setXml(null);
    setNombreXml(null);
    setNombrePdf(null);
    if (xmlRef.current) xmlRef.current.value = "";
    if (pdfRef.current) pdfRef.current.value = "";
  };

  const leerXml = async (archivo: File) => {
    if (archivo.size > MAX_XML) {
      limpiar();
      sileo.error({ title: "El XML supera el tamaño máximo de 1 MB." });
      return;
    }

    try {
      const texto = await archivo.text();
      const cfdi = parsearCfdi(texto);
      setXml(texto);
      setDatos(cfdi);
      setNombreXml(archivo.name);
      sileo.success({ title: "CFDI leído correctamente." });
    } catch (error) {
      limpiar();
      sileo.error({
        title: "No se pudo leer el CFDI.",
        description:
          error instanceof Error ? error.message : "Verifica que el archivo sea un CFDI válido.",
      });
    }
  };

  const leerPdf = (archivo: File) => {
    const esPdf = archivo.type === "application/pdf" || /\.pdf$/i.test(archivo.name);

    if (!esPdf) {
      if (pdfRef.current) pdfRef.current.value = "";
      setNombrePdf(null);
      sileo.error({ title: "El archivo del PDF no es válido." });
      return;
    }
    if (archivo.size > MAX_PDF) {
      if (pdfRef.current) pdfRef.current.value = "";
      setNombrePdf(null);
      sileo.error({ title: "El PDF supera el tamaño máximo de 5 MB." });
      return;
    }

    setNombrePdf(archivo.name);
  };

  const guardar = async () => {
    if (!xml || !datos) {
      sileo.error({ title: "Adjunta primero el XML del CFDI." });
      return;
    }

    setGuardando(true);
    try {
      const resultado = await guardarCfdi({ xml, datos });
      if (resultado.ok) {
        limpiar();
        router.refresh();
        sileo.success({ title: "CFDI guardado correctamente." });
      } else {
        sileo.error({ title: "No se pudo guardar el CFDI.", description: resultado.mensaje });
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 pb-14">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium tracking-tight">CFDI</h1>
        <p className="text-sm text-muted-foreground">
          Adjunta el XML y el PDF de un CFDI para leer sus datos y registrarlo.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Adjuntar CFDI</CardTitle>
          <CardDescription>
            El XML contiene los datos del comprobante. El PDF es la representación impresa y solo se
            verifica el tipo y el tamaño.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="cfdi-xml">XML del CFDI</FieldLabel>
                <Input
                  id="cfdi-xml"
                  ref={xmlRef}
                  type="file"
                  accept=".xml,application/xml,text/xml"
                  disabled={guardando}
                  onChange={(evento) => {
                    const archivo = evento.target.files?.[0];
                    if (archivo) void leerXml(archivo);
                  }}
                />
                <FieldDescription>
                  {nombreXml ?? "Obligatorio. Tamaño máximo 1 MB."}
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="cfdi-pdf">PDF del CFDI</FieldLabel>
                <Input
                  id="cfdi-pdf"
                  ref={pdfRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={guardando}
                  onChange={(evento) => {
                    const archivo = evento.target.files?.[0];
                    if (archivo) leerPdf(archivo);
                  }}
                />
                <FieldDescription>
                  {nombrePdf ?? "Opcional. Tamaño máximo 5 MB."}
                </FieldDescription>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
        {datos ? (
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost" onClick={limpiar} disabled={guardando}>
              Limpiar
            </Button>
            <Button onClick={guardar} disabled={guardando}>
              {guardando ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SaveIcon data-icon="inline-start" />
              )}
              Guardar CFDI
            </Button>
          </CardFooter>
        ) : null}
      </Card>

      {datos ? <DetalleCfdi datos={datos} /> : null}

      <SeccionGuardados cfdis={cfdis} />
    </div>
  );
}

function DetalleCfdi({ datos }: { datos: Cfdi }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del CFDI</CardTitle>
        <CardDescription>
          Información leída directamente del XML. Los importes se muestran en la moneda del
          comprobante.
        </CardDescription>
        <CardAction>
          <Badge>{TIPOS[datos.tipoDeComprobante] ?? datos.tipoDeComprobante}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Bloque titulo="Comprobante">
          <Dato etiqueta="Versión" valor={datos.version} />
          <Dato etiqueta="Serie" valor={datos.serie} />
          <Dato etiqueta="Folio" valor={datos.folio} />
          <Dato etiqueta="Tipo" valor={TIPOS[datos.tipoDeComprobante] ?? datos.tipoDeComprobante} />
          <Dato etiqueta="Fecha" valor={fecha(datos.fecha)} />
          <Dato etiqueta="Método de pago" valor={datos.metodoPago} />
          <Dato etiqueta="Forma de pago" valor={datos.formaPago} />
          <Dato etiqueta="Moneda" valor={datos.moneda} />
          <Dato etiqueta="Tipo de cambio" valor={datos.tipoCambio} />
          <Dato etiqueta="Exportación" valor={datos.exportacion} />
          <Dato etiqueta="Lugar de expedición" valor={datos.lugarExpedicion} />
          <Dato etiqueta="Condiciones de pago" valor={datos.condicionesDePago} />
        </Bloque>

        <Bloque titulo="Emisor">
          <Dato etiqueta="RFC" valor={datos.emisor.rfc} />
          <Dato etiqueta="Nombre" valor={datos.emisor.nombre} />
          <Dato etiqueta="Régimen fiscal" valor={datos.emisor.regimenFiscal} />
        </Bloque>

        <Bloque titulo="Receptor">
          <Dato etiqueta="RFC" valor={datos.receptor.rfc} />
          <Dato etiqueta="Nombre" valor={datos.receptor.nombre} />
          <Dato etiqueta="Domicilio fiscal" valor={datos.receptor.domicilioFiscal} />
          <Dato etiqueta="Régimen fiscal" valor={datos.receptor.regimenFiscal} />
          <Dato etiqueta="Uso del CFDI" valor={datos.receptor.usoCfdi} />
        </Bloque>

        <Bloque titulo="Importes">
          <Dato etiqueta="Subtotal" valor={importe(datos.subtotal)} />
          <Dato etiqueta="Descuento" valor={importe(datos.descuento)} />
          <Dato etiqueta="Total" valor={importe(datos.total)} />
          <Dato etiqueta="Impuestos trasladados" valor={importe(datos.impuestos.totalTrasladados)} />
          <Dato etiqueta="Impuestos retenidos" valor={importe(datos.impuestos.totalRetenidos)} />
        </Bloque>

        {datos.conceptos.length > 0 ? (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Conceptos</h3>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clave</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Valor unitario</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                    <TableHead className="text-right">Descuento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datos.conceptos.map((concepto, indice) => (
                    <TableRow key={indice}>
                      <TableCell className="font-mono text-xs">{concepto.claveProdServ}</TableCell>
                      <TableCell className="tabular-nums">{concepto.cantidad}</TableCell>
                      <TableCell>{concepto.unidad || concepto.claveUnidad}</TableCell>
                      <TableCell className="max-w-md truncate">{concepto.descripcion}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {importe(concepto.valorUnitario)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {importe(concepto.importe)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {importe(concepto.descuento)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : null}

        {datos.impuestos.traslados.length > 0 ? (
          <TablaImpuestos titulo="Impuestos trasladados" detalles={datos.impuestos.traslados} />
        ) : null}
        {datos.impuestos.retenciones.length > 0 ? (
          <TablaImpuestos titulo="Impuestos retenidos" detalles={datos.impuestos.retenciones} />
        ) : null}

        {datos.timbre ? (
          <Bloque titulo="Timbre fiscal digital">
            <Dato etiqueta="UUID" valor={datos.timbre.uuid} />
            <Dato etiqueta="Versión" valor={datos.timbre.version} />
            <Dato etiqueta="Fecha de timbrado" valor={fecha(datos.timbre.fechaTimbrado)} />
            <Dato etiqueta="RFC proveedor de certificación" valor={datos.timbre.rfcProvCertif} />
            <Dato etiqueta="No. de certificado del SAT" valor={datos.timbre.noCertificadoSat} />
            {datos.timbre.selloCfd || datos.timbre.selloSat ? (
              <details className="sm:col-span-2 md:col-span-3">
                <summary className="cursor-pointer text-xs text-muted-foreground">Sellos</summary>
                <div className="mt-2 flex flex-col gap-2 font-mono text-xs break-all text-muted-foreground">
                  {datos.timbre.selloCfd ? <p>CFD: {datos.timbre.selloCfd}</p> : null}
                  {datos.timbre.selloSat ? <p>SAT: {datos.timbre.selloSat}</p> : null}
                </div>
              </details>
            ) : null}
          </Bloque>
        ) : null}
      </CardContent>
    </Card>
  );
}

function TablaImpuestos({
  titulo,
  detalles,
}: {
  titulo: string;
  detalles: ImpuestoDetalle[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{titulo}</h3>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Impuesto</TableHead>
              <TableHead>Tipo de factor</TableHead>
              <TableHead className="text-right">Base</TableHead>
              <TableHead className="text-right">Tasa o cuota</TableHead>
              <TableHead className="text-right">Importe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detalles.map((detalle, indice) => (
              <TableRow key={indice}>
                <TableCell>{detalle.impuesto}</TableCell>
                <TableCell>{detalle.tipoFactor}</TableCell>
                <TableCell className="text-right tabular-nums">{importe(detalle.base)}</TableCell>
                <TableCell className="text-right tabular-nums">{detalle.tasaOCuota || "—"}</TableCell>
                <TableCell className="text-right tabular-nums">{importe(detalle.importe)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SeccionGuardados({ cfdis }: { cfdis: CfdiGuardado[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CFDI guardados</CardTitle>
        <CardDescription>Comprobantes registrados en tu organización.</CardDescription>
      </CardHeader>
      <CardContent>
        {cfdis.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ReceiptTextIcon />
              </EmptyMedia>
              <EmptyTitle>Todavía no hay CFDI</EmptyTitle>
              <EmptyDescription>
                Adjunta un XML para leer y registrar el primer comprobante.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Serie / Folio</TableHead>
                  <TableHead>Emisor</TableHead>
                  <TableHead>Receptor</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>UUID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cfdis.map((cfdi) => (
                  <TableRow key={cfdi.id}>
                    <TableCell className="tabular-nums">{fecha(cfdi.fecha ?? "")}</TableCell>
                    <TableCell>
                      {cfdi.tipo_comprobante
                        ? (TIPOS[cfdi.tipo_comprobante] ?? cfdi.tipo_comprobante)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {[cfdi.serie, cfdi.folio].filter(Boolean).join(" / ") || "—"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{cfdi.emisor_nombre ?? "—"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {cfdi.receptor_nombre ?? "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {cfdi.total === null
                        ? "—"
                        : `${cfdi.moneda ?? ""} ${importe(String(cfdi.total))}`.trim()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{cfdi.uuid_fiscal ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{titulo}</h3>
      <dl className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">{children}</dl>
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{etiqueta}</dt>
      <dd className="truncate text-sm tabular-nums">{valor || "—"}</dd>
    </div>
  );
}

function fecha(valor: string) {
  return valor ? valor.replace("T", " ").trim() : "—";
}

function importe(valor: string) {
  if (!valor) return "—";
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return valor;
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero);
}
