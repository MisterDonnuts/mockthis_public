import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class QuestionDataRequest {

    @IsString()
    @IsNotEmpty()
    mockText: string;

    @IsString()
    @IsNotEmpty()
    examples: string;

    @IsString()
    @IsOptional()
    interfaces?: string;
    
}

export class JsonDataRequest {

    @IsString()
    @IsNotEmpty()
    jsonText: string;

    @IsString()
    @IsNotEmpty()
    result:string;

    @IsString()
    @IsOptional()
    notes?: string;
    
}

export class SetModelRequest{
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    model: string;
    
}

export class SetTempRequest{
    @IsNumber()
    @Min(0)
    @Max(1)
    temp: number;
    
}

export class SetTokensRequest{
    @IsNumber()
    @Min(1)
    @Max(2048)
    tokens: number;
    
}
