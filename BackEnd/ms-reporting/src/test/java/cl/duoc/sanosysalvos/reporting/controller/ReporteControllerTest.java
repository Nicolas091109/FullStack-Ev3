package cl.duoc.sanosysalvos.reporting.controller;

import cl.duoc.sanosysalvos.reporting.model.ReporteMascota;
import cl.duoc.sanosysalvos.reporting.model.Comentario;
import cl.duoc.sanosysalvos.reporting.service.ReporteService;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ReporteController.class)
public class ReporteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ReporteService reporteService;

    private ReporteMascota testReporte;

    @BeforeEach
    void setUp() {
        testReporte = new ReporteMascota();
        testReporte.setId("rep-123");
        testReporte.setTipoAnimal("Perro");
        testReporte.setDescripcion("Perro salchicha perdido cerca de la plaza");
        testReporte.setUbicacionId(1L);
        testReporte.setUsuarioId(10L);
        testReporte.setEstado("ACTIVO");
        testReporte.setNombreMascota("Fido");
        testReporte.setTamano("Pequeño");
        testReporte.setFechaRegistro("2026-06-21T15:00:00");
        testReporte.setComentarios(new ArrayList<>());
    }

    @Test
    void testCrearReporte_Success() throws Exception {
        when(reporteService.crearReporte(any(ReporteMascota.class))).thenReturn(testReporte);

        mockMvc.perform(post("/api/reportes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testReporte)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("rep-123"))
                .andExpect(jsonPath("$.tipoAnimal").value("Perro"))
                .andExpect(jsonPath("$.descripcion").value("Perro salchicha perdido cerca de la plaza"))
                .andExpect(jsonPath("$.estado").value("ACTIVO"));

        verify(reporteService).crearReporte(any(ReporteMascota.class));
    }

    @Test
    void testCrearReporte_ValidationFailure_MissingTipoAnimal() throws Exception {
        testReporte.setTipoAnimal(""); // Obligatorio

        mockMvc.perform(post("/api/reportes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testReporte)))
                .andExpect(status().isBadRequest());

        verify(reporteService, never()).crearReporte(any(ReporteMascota.class));
    }

    @Test
    void testListarReportes_Success() throws Exception {
        when(reporteService.listarReportes()).thenReturn(List.of(testReporte));

        mockMvc.perform(get("/api/reportes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("rep-123"))
                .andExpect(jsonPath("$[0].tipoAnimal").value("Perro"))
                .andExpect(jsonPath("$[0].descripcion").value("Perro salchicha perdido cerca de la plaza"));

        verify(reporteService).listarReportes();
    }

    @Test
    void testActualizarReporte_Success() throws Exception {
        when(reporteService.actualizarReporte(eq("rep-123"), any(ReporteMascota.class))).thenReturn(testReporte);

        mockMvc.perform(put("/api/reportes/rep-123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testReporte)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("rep-123"))
                .andExpect(jsonPath("$.tipoAnimal").value("Perro"));

        verify(reporteService).actualizarReporte(eq("rep-123"), any(ReporteMascota.class));
    }

    @Test
    void testEliminarReporte_Success() throws Exception {
        doNothing().when(reporteService).eliminarReporte("rep-123");

        mockMvc.perform(delete("/api/reportes/rep-123"))
                .andExpect(status().isNoContent());

        verify(reporteService).eliminarReporte("rep-123");
    }

    @Test
    void testAgregarComentario_Success() throws Exception {
        Comentario comentario = new Comentario();
        comentario.setTexto("Lo vi por la calle Bilbao");
        comentario.setUsuarioId(5L);
        comentario.setUsuarioNombre("Maria");

        ReporteMascota reporteConComentario = new ReporteMascota();
        reporteConComentario.setId("rep-123");
        reporteConComentario.setTipoAnimal("Perro");
        reporteConComentario.setDescripcion("Perro salchicha perdido cerca de la plaza");
        reporteConComentario.getComentarios().add(comentario);

        when(reporteService.agregarComentario(eq("rep-123"), any(Comentario.class))).thenReturn(reporteConComentario);

        mockMvc.perform(post("/api/reportes/rep-123/comentarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(comentario)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("rep-123"))
                .andExpect(jsonPath("$.comentarios[0].texto").value("Lo vi por la calle Bilbao"))
                .andExpect(jsonPath("$.comentarios[0].usuarioNombre").value("Maria"));

        verify(reporteService).agregarComentario(eq("rep-123"), any(Comentario.class));
    }
}
