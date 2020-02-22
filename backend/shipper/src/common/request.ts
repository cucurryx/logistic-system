
export class OrderCreateRequest {
    public constructor(id: string, client: string, receiver: string, name: string, source: string, destination: string, description: string) {}
    
    public id: string;
    public client: string;
    public receiver: string;
    public name: string;
    public source: string;
    public destination: string;
    public description: string;
}
