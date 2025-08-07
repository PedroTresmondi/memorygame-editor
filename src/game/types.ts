export interface BoardConfig {
  width: number;
  height: number;
  modo: string;
  animation: {
    type: string;
    duration: number;
  };
  grid: {
    cols: number;
    rows: number;
    numPares: number;
    gap: number;
  };
  card: {
    width: number;
    height: number;
    borderRadius: number;
    boxShadow: string;
    font: string;
  };
  background: {
    color: string;
    image: string | null;
  };
  darkMode: boolean;
  showFaces: boolean;
}
