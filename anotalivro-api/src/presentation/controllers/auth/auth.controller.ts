import { Body, Controller, Param, Post, UsePipes } from "@nestjs/common";

import { z } from "zod";

import type { 
  RefreshTokenUseCase, 
  SignInUseCase, 
  SignOutUseCase, 
  SignUpUseCase 
} from "src/application/use-cases/auth";

import { ControllerErrorHandlerDecorator, Public } from "../../decorators";
import { ZodValidationPipe } from "src/infra/pipes";
import { HttpCreatedResponse, HttpSuccessResponse } from "../../helpers";

import { 
  signUpSchema, 
  SignUpSchema,
  signInSchema, 
  SignInSchema, 
  signOutSchema, 
  SignOutSchema, 
  refreshTokenSchema, 
  RefreshTokenSchema, 
} from "./schemas";

@Controller('auth')
export class AuthController {
  constructor(
    private signUpUseCase: SignUpUseCase,
    private signInUseCase: SignInUseCase,
    private signOutUseCase: SignOutUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('sign-up')
  @Public()
  @ControllerErrorHandlerDecorator()
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signUp(@Body() body: SignUpSchema) {
    const { email, password } = body

    const response = await this.signUpUseCase.execute({
      email,
      password
    })

    return HttpCreatedResponse(response)
  }   

  @Post('sign-in')
  @Public()
  @ControllerErrorHandlerDecorator()
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(@Body() body: SignInSchema) {
    const { email, password } = body

    const response = await this.signInUseCase.execute({
      email,
      password
    })

    return HttpSuccessResponse(response)
  }

  @Post('sign-out/:user_id')
  @Public()
  @ControllerErrorHandlerDecorator()
  @UsePipes(new ZodValidationPipe(signOutSchema))
  async signOut(@Param() params: SignOutSchema) {
    const { user_id } = params

    const response = await this.signOutUseCase.execute({
      user_id
    })

    return HttpSuccessResponse(response)
  }

  @Post('refresh-token')
  @Public()
  @ControllerErrorHandlerDecorator()
  @UsePipes(new ZodValidationPipe(refreshTokenSchema))
  async refreshToken(@Body() body: RefreshTokenSchema) {
    const { refresh_token } = body

    const response = await this.refreshTokenUseCase.execute({
      refresh_token
    })

    return HttpCreatedResponse(response)
  }
}