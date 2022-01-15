import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Create";
const event: APIGatewayProxyEvent = {
    body:{
        
        name: 'Pune',
        location: 'some location'
    }
} as any;
handler(event as any, {} as any); 

