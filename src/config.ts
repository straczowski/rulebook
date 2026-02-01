import { z } from "zod"

const configSchema = z.object({
  port: z.coerce.number().default(3000),
  rulesDirectory: z.string().default("./rules"),
})

export type Config = z.infer<typeof configSchema>

export const parseConfig = (): Config => {
  return configSchema.parse({
    port: process.env.PORT,
    rulesDirectory: process.env.RULES_DIRECTORY,
  })
}
