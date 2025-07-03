// Custom JSX runtime implementation
// This is a minimal polyfill for the jsx-runtime to fix TypeScript errors

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsx(type: any, props: any): any {
  return { type, props };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsxs(type: any, props: any): any {
  return jsx(type, props);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Fragment(props: any): any {
  return props.children;
}

export default {
  jsx,
  jsxs,
  Fragment
};
