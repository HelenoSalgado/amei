import { AmeiError } from "../api/Error";

export function IsEmail() {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;
      descriptor.value = async function(...args: any) {
        const body = args[1];
        if(body.email){
        const email = String(body.email)
            .toLowerCase()
            .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
          if(!email) throw new AmeiError('Email Inválido', 400);
        };
        return originalMethod.apply(this, args);
      };
      return descriptor;
    }
}