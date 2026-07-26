import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class WorkflowService {
  // Definición de la Máquina de Estados
  private transitions: Record<string, Record<string, string[]>> = {
    BillingCycle: {
      DRAFT: ['SUBMITTED'],           // De Borrador solo puede pasar a Enviado
      SUBMITTED: ['APPROVED', 'REJECTED'], // De Enviado puede pasar a Aprobado o Rechazado
      REJECTED: ['DRAFT'],            // Si se rechaza, vuelve a Borrador
      APPROVED: ['INVOICED'],         // De Aprobado solo puede pasar a Facturado
      INVOICED: [],                   // Estado final, no permite cambios
    },
    Contract: {
      PENDING: ['ACTIVE', 'CANCELLED'],
      ACTIVE: ['EXPIRED', 'CANCELLED'],
      EXPIRED: ['ACTIVE'],
      CANCELLED: [],
    }
  };

  // Método para validar si el cambio es permitido
  validateTransition(entity: string, currentState: string, nextState: string) {
    const allowedTransitions = this.transitions[entity]?.[currentState] || [];
    
    if (!allowedTransitions.includes(nextState)) {
      throw new BadRequestException(
        `Transición inválida: No se puede cambiar el estado de "${currentState}" a "${nextState}".`
      );
    }
    
    return true;
  }
}