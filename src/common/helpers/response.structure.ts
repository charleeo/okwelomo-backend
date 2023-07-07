import { Injectable } from "@nestjs/common";


export function responseStructure(status,message,data,statusCode=200):any {
    return {
        data,
        message,
        status,
        statusCode
    }
}