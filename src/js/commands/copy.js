import { Command } from '../Command.js'
import { CommandFactory } from '../CommandFactory.js'
import { InputIterator } from '../InputIterator.js'
import { SlotIterator } from '../SlotIterator.js'
import { getIndexFromSlotString, numberToSlotId, showError } from '../utils.js'

export class CopyCommandFactory extends CommandFactory {
  static commandAcronym = 'COP'
  static commandAliases = {
    COP: 'Copiar',
    CP: 'Copiar, mas escrito com só 2 letras',
  }
  static commandGroup = 'data'
  static commandDescription = 'Copia os dados de um escaninho para o outro.'
  static commandUsage = ['COP Ex, Ey', 'CP Ex, Ey']
  static commandUsageDescription = `
    Ex é o escaninho que possui os dados que serão copiados.
    Ey é o escaninho onde os dados serão salvos.

    Exemplo:
    E15 = 17;

    "COP E15, E14" salvará o valor 17 no escaninho 14.
  `.trim()

  /**
   * Builds a command.
   *
   * @param {SlotIterator} slotIterator
   * @param {InputIterator} _inputIterator
   * @returns {Command}
   */
  build(slotIterator, _inputIterator) {
    const command = new Command()

    command.setAcronym(CopyCommandFactory.commandAcronym)
    command.setAliases(CopyCommandFactory.commandAliases)

    const copyBaseBehavior = (...args) => {
      const slotId = numberToSlotId(slotIterator.current())

      const aliases = Object.keys(CopyCommandFactory.commandAliases).filter(
        (key) => key !== CopyCommandFactory.commandAcronym
      )

      if (args.length !== 2) {
        throw `${slotId}: O comando ${
          CopyCommandFactory.commandAcronym
        } (ou ${aliases.join(', ')}) deve receber 2 argumentos!`
      }

      const originSlotIdx = getIndexFromSlotString(args[0])
      const destinySlotIdx = getIndexFromSlotString(args[1])

      const originSlot = document.getElementById(args[0])
      const destinySlot = document.getElementById(args[1])

      if (originSlot === null || destinySlot === null) {
        throw `${slotId}: ${originSlotIdx} e/ou ${destinySlotIdx} estão errados!`
      }

      destinySlot.value = originSlot.value
    }

    const copyBehavior = (...args) => {
      try {
        copyBaseBehavior(...args)
        return 1
      } catch (err) {
        showError(err)
        return 0
      }
    }

    command.setBehavior(copyBehavior)

    return command
  }
}
