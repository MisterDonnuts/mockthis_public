import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ReceptorService } from './receptor.service';
import { JsonDataRequest, QuestionDataRequest } from './receptor.domain';

@Controller('receptor')
export class ReceptorController {

    constructor(private receptorSrv: ReceptorService) { }

    @HttpCode(HttpStatus.OK)
    @Post('/chat')
    getModelResponseChat(@Body() data: QuestionDataRequest) {
        try {
            return this.receptorSrv.getChat(data.mockText, data.examples, data.interfaces);
        } catch (error) {
            throw new HttpException('Unable to get response from server, try latter.', HttpStatus.BAD_GATEWAY)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('/json')
    getModelResponseJson(@Body() data: JsonDataRequest) {
        try {
            return this.receptorSrv.getJsonConvert(data.jsonText, data.result, data.notes);
        } catch (error) {
            throw new HttpException('Unable to get response from server, try latter.', HttpStatus.BAD_GATEWAY)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('/complete')
    getModelResponseComplete(@Body() data: QuestionDataRequest) {
        try {
            return this.receptorSrv.getComplete(data.mockText, data.examples, data.interfaces);
        } catch (error) {
            throw new HttpException('Unable to get response from server, try latter.', HttpStatus.BAD_GATEWAY)
        }
    }

}
