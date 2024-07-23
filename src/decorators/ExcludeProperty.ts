export function ExcludeProperty(properties: String[]) {

  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any) {
      const body = args[1];
      properties.forEach((key) => {
       delete body[key as string]
      })
      return originalMethod.apply(this, args);
    };
    return descriptor;
  }
}
