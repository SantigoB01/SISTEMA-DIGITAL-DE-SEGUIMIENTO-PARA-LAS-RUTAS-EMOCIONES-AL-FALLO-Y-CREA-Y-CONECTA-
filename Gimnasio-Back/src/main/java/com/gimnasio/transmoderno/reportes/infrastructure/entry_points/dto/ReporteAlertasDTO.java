
public class ReporteAlertasDTO {

    private int total;
    private int atendidas;
    private int pendientes;

    public ReporteAlertasDTO() {}

    public ReporteAlertasDTO(int total, int atendidas, int pendientes) {
        this.total = total;
        this.atendidas = atendidas;
        this.pendientes = pendientes;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getAtendidas() {
        return atendidas;
    }

    public void setAtendidas(int atendidas) {
        this.atendidas = atendidas;
    }

    public int getPendientes() {
        return pendientes;
    }

    public void setPendientes(int pendientes) {
        this.pendientes = pendientes;
    }
}