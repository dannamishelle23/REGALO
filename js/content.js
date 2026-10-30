import { configuracion } from "./data/configuracion.js";
export function cargarContenido() {
  const d=configuracion.destinatario, dg=configuracion.diagnostico, f=configuracion.final;
  const values={nombre:d.nombre,edad:d.edad,tipo:d.tipo,caracteristicas:d.caracteristicas,causa:dg.causa,diagnosticoDescripcion:dg.descripcion,estado:dg.estado,finalEstado:f.estado,felicitacion:f.felicitacion,mensajeFinal:f.mensaje};
  Object.entries(values).forEach(([key,value])=>document.querySelectorAll(`[data-config="${key}"]`).forEach(el=>{el.textContent=value; if(el.hasAttribute("data-field-text"))el.dataset.fieldText=value;}));
  const wrap=document.querySelector("[data-final-parrafos]"); if(wrap)wrap.innerHTML=f.parrafos.map(p=>`<p>${p}</p>`).join("");
}
