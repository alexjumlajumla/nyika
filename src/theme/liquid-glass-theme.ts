export interface LiquidGlassTheme {
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number;
  padding?: string;
  overLight?: boolean;
  mode?: 'standard' | 'polar' | 'prominent' | 'shader';
}

export const liquidGlassTheme: LiquidGlassTheme = {
  displacementScale: 0.5,
  blurAmount: 15,
  saturation: 1.2,
  aberrationIntensity: 0.5,
  elasticity: 0.5,
  cornerRadius: 16,
  padding: '1.5rem',
  overLight: false,
  mode: 'standard',
};
