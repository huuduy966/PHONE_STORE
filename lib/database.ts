import { createClient, type Client, type Config, type InValue, type ResultSet } from '@libsql/client';

type QueryResult = { results: Record<string, unknown>[]; meta: { changes: number } };
function convert(result: ResultSet): QueryResult { return {results: result.rows as unknown as Record<string, unknown>[],meta:{changes:result.rowsAffected}}; }
class Statement {
  args: InValue[] = [];
  client: Client;
  sql: string;
  constructor(client: Client, sql: string) { this.client=client; this.sql=sql; }
  bind(...args: InValue[]) { const statement = new Statement(this.client,this.sql); statement.args = args; return statement; }
  async all<T = Record<string, unknown>>() { return convert(await this.client.execute({sql:this.sql,args:this.args})) as unknown as {results:T[];meta:{changes:number}}; }
  async first<T = Record<string, unknown>>() { return (await this.all<T>()).results[0] ?? null; }
  async run() { return convert(await this.client.execute({sql:this.sql,args:this.args})); }
}
export function createDatabase(config: Config) {
  const client=createClient(config);
  return {
    prepare(sql:string) { return new Statement(client,sql); },
    async batch(statements: Statement[]) { return (await client.batch(statements.map(s=>({sql:s.sql,args:s.args})), 'write')).map(convert); },
  };
}
const url=process.env.TURSO_DATABASE_URL;
export const database=url ? createDatabase({url,authToken:process.env.TURSO_AUTH_TOKEN}) : undefined;
