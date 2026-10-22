// Pure state transition shared by the external probe and its simulations.
export function observe(previous, healthy, now, { failures = 3, successes = 2 } = {}) {
  const state = { failed: 0, passed: 0, incident: null, notified: 0, ...previous };
  state.failed = healthy ? 0 : state.failed + 1;
  state.passed = healthy ? state.passed + 1 : 0;
  let kind = null;
  if (!state.incident && state.failed >= failures) {
    state.incident = now;
    kind = 'incidencia';
  } else if (state.incident && state.passed >= successes) {
    kind = 'recuperacion';
  } else if (state.incident && !healthy && now - state.notified >= 86400000) {
    kind = 'recordatorio';
  }
  const key = kind ? `foodtrucks-public-${state.incident}-${kind}-${kind === 'recordatorio' ? Math.floor(now / 86400000) : 'once'}` : null;
  return { state, event: kind ? { kind, key, incident: state.incident } : null };
}

export function acknowledged(state, event, now) {
  return { ...state, notified: now, incident: event.kind === 'recuperacion' ? null : state.incident };
}

export function message(event, { environment, release, target, test = false }, now) {
  const kind = { incidencia: 'ALERTA', recordatorio: 'RECORDATORIO', recuperacion: 'RECUPERACIÓN' }[event.kind];
  const time = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', dateStyle: 'short', timeStyle: 'long' }).format(now);
  return {
    subject: `${test ? '[PRUEBA] ' : ''}[Foodtrucks ${environment}] ${kind}: API pública`,
    text: `Entorno: ${environment}\nSeñal: API pública, DNS o TLS\nHora de Madrid: ${time}\nRelease: ${release || 'no disponible desde sonda externa'}\nImpacto: ${event.kind === 'recuperacion' ? 'La API vuelve a responder.' : 'La API no responde correctamente desde fuera del domicilio.'}\nDestino: ${target}\nAcción: ${event.kind === 'recuperacion' ? 'Comprobar el informe del incidente.' : 'Revisar Internet, Tunnel, TLS y servicios en la VM; consultar el informe de GitHub.'}\n`,
  };
}
