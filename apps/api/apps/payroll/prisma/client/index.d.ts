
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Salary
 * 
 */
export type Salary = $Result.DefaultSelection<Prisma.$SalaryPayload>
/**
 * Model PayrollRecord
 * 
 */
export type PayrollRecord = $Result.DefaultSelection<Prisma.$PayrollRecordPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const PayrollStatus: {
  DRAFT: 'DRAFT',
  PROCESSED: 'PROCESSED',
  PAID: 'PAID'
};

export type PayrollStatus = (typeof PayrollStatus)[keyof typeof PayrollStatus]

}

export type PayrollStatus = $Enums.PayrollStatus

export const PayrollStatus: typeof $Enums.PayrollStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Salaries
 * const salaries = await prisma.salary.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Salaries
   * const salaries = await prisma.salary.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.salary`: Exposes CRUD operations for the **Salary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Salaries
    * const salaries = await prisma.salary.findMany()
    * ```
    */
  get salary(): Prisma.SalaryDelegate<ExtArgs>;

  /**
   * `prisma.payrollRecord`: Exposes CRUD operations for the **PayrollRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PayrollRecords
    * const payrollRecords = await prisma.payrollRecord.findMany()
    * ```
    */
  get payrollRecord(): Prisma.PayrollRecordDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.20.0
   * Query Engine version: 06fc58a368dc7be9fbbbe894adf8d445d208c284
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Salary: 'Salary',
    PayrollRecord: 'PayrollRecord'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "salary" | "payrollRecord"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Salary: {
        payload: Prisma.$SalaryPayload<ExtArgs>
        fields: Prisma.SalaryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SalaryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SalaryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaryPayload>
          }
          findFirst: {
            args: Prisma.SalaryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SalaryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaryPayload>
          }
          findMany: {
            args: Prisma.SalaryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaryPayload>[]
          }
          create: {
            args: Prisma.SalaryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaryPayload>
          }
          createMany: {
            args: Prisma.SalaryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SalaryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaryPayload>[]
          }
          delete: {
            args: Prisma.SalaryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaryPayload>
          }
          update: {
            args: Prisma.SalaryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaryPayload>
          }
          deleteMany: {
            args: Prisma.SalaryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SalaryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SalaryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalaryPayload>
          }
          aggregate: {
            args: Prisma.SalaryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSalary>
          }
          groupBy: {
            args: Prisma.SalaryGroupByArgs<ExtArgs>
            result: $Utils.Optional<SalaryGroupByOutputType>[]
          }
          count: {
            args: Prisma.SalaryCountArgs<ExtArgs>
            result: $Utils.Optional<SalaryCountAggregateOutputType> | number
          }
        }
      }
      PayrollRecord: {
        payload: Prisma.$PayrollRecordPayload<ExtArgs>
        fields: Prisma.PayrollRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayrollRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayrollRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollRecordPayload>
          }
          findFirst: {
            args: Prisma.PayrollRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayrollRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollRecordPayload>
          }
          findMany: {
            args: Prisma.PayrollRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollRecordPayload>[]
          }
          create: {
            args: Prisma.PayrollRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollRecordPayload>
          }
          createMany: {
            args: Prisma.PayrollRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PayrollRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollRecordPayload>[]
          }
          delete: {
            args: Prisma.PayrollRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollRecordPayload>
          }
          update: {
            args: Prisma.PayrollRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollRecordPayload>
          }
          deleteMany: {
            args: Prisma.PayrollRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayrollRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayrollRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayrollRecordPayload>
          }
          aggregate: {
            args: Prisma.PayrollRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayrollRecord>
          }
          groupBy: {
            args: Prisma.PayrollRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayrollRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.PayrollRecordCountArgs<ExtArgs>
            result: $Utils.Optional<PayrollRecordCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Salary
   */

  export type AggregateSalary = {
    _count: SalaryCountAggregateOutputType | null
    _avg: SalaryAvgAggregateOutputType | null
    _sum: SalarySumAggregateOutputType | null
    _min: SalaryMinAggregateOutputType | null
    _max: SalaryMaxAggregateOutputType | null
  }

  export type SalaryAvgAggregateOutputType = {
    basicSalary: Decimal | null
    allowance: Decimal | null
    deduction: Decimal | null
    netSalary: Decimal | null
  }

  export type SalarySumAggregateOutputType = {
    basicSalary: Decimal | null
    allowance: Decimal | null
    deduction: Decimal | null
    netSalary: Decimal | null
  }

  export type SalaryMinAggregateOutputType = {
    id: string | null
    userId: string | null
    basicSalary: Decimal | null
    allowance: Decimal | null
    deduction: Decimal | null
    netSalary: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SalaryMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    basicSalary: Decimal | null
    allowance: Decimal | null
    deduction: Decimal | null
    netSalary: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SalaryCountAggregateOutputType = {
    id: number
    userId: number
    basicSalary: number
    allowance: number
    deduction: number
    netSalary: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SalaryAvgAggregateInputType = {
    basicSalary?: true
    allowance?: true
    deduction?: true
    netSalary?: true
  }

  export type SalarySumAggregateInputType = {
    basicSalary?: true
    allowance?: true
    deduction?: true
    netSalary?: true
  }

  export type SalaryMinAggregateInputType = {
    id?: true
    userId?: true
    basicSalary?: true
    allowance?: true
    deduction?: true
    netSalary?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SalaryMaxAggregateInputType = {
    id?: true
    userId?: true
    basicSalary?: true
    allowance?: true
    deduction?: true
    netSalary?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SalaryCountAggregateInputType = {
    id?: true
    userId?: true
    basicSalary?: true
    allowance?: true
    deduction?: true
    netSalary?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SalaryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Salary to aggregate.
     */
    where?: SalaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salaries to fetch.
     */
    orderBy?: SalaryOrderByWithRelationInput | SalaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SalaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Salaries
    **/
    _count?: true | SalaryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SalaryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SalarySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SalaryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SalaryMaxAggregateInputType
  }

  export type GetSalaryAggregateType<T extends SalaryAggregateArgs> = {
        [P in keyof T & keyof AggregateSalary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSalary[P]>
      : GetScalarType<T[P], AggregateSalary[P]>
  }




  export type SalaryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalaryWhereInput
    orderBy?: SalaryOrderByWithAggregationInput | SalaryOrderByWithAggregationInput[]
    by: SalaryScalarFieldEnum[] | SalaryScalarFieldEnum
    having?: SalaryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SalaryCountAggregateInputType | true
    _avg?: SalaryAvgAggregateInputType
    _sum?: SalarySumAggregateInputType
    _min?: SalaryMinAggregateInputType
    _max?: SalaryMaxAggregateInputType
  }

  export type SalaryGroupByOutputType = {
    id: string
    userId: string
    basicSalary: Decimal
    allowance: Decimal
    deduction: Decimal
    netSalary: Decimal
    createdAt: Date
    updatedAt: Date
    _count: SalaryCountAggregateOutputType | null
    _avg: SalaryAvgAggregateOutputType | null
    _sum: SalarySumAggregateOutputType | null
    _min: SalaryMinAggregateOutputType | null
    _max: SalaryMaxAggregateOutputType | null
  }

  type GetSalaryGroupByPayload<T extends SalaryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SalaryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SalaryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SalaryGroupByOutputType[P]>
            : GetScalarType<T[P], SalaryGroupByOutputType[P]>
        }
      >
    >


  export type SalarySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    basicSalary?: boolean
    allowance?: boolean
    deduction?: boolean
    netSalary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["salary"]>

  export type SalarySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    basicSalary?: boolean
    allowance?: boolean
    deduction?: boolean
    netSalary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["salary"]>

  export type SalarySelectScalar = {
    id?: boolean
    userId?: boolean
    basicSalary?: boolean
    allowance?: boolean
    deduction?: boolean
    netSalary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SalaryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Salary"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      basicSalary: Prisma.Decimal
      allowance: Prisma.Decimal
      deduction: Prisma.Decimal
      netSalary: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["salary"]>
    composites: {}
  }

  type SalaryGetPayload<S extends boolean | null | undefined | SalaryDefaultArgs> = $Result.GetResult<Prisma.$SalaryPayload, S>

  type SalaryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SalaryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SalaryCountAggregateInputType | true
    }

  export interface SalaryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Salary'], meta: { name: 'Salary' } }
    /**
     * Find zero or one Salary that matches the filter.
     * @param {SalaryFindUniqueArgs} args - Arguments to find a Salary
     * @example
     * // Get one Salary
     * const salary = await prisma.salary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SalaryFindUniqueArgs>(args: SelectSubset<T, SalaryFindUniqueArgs<ExtArgs>>): Prisma__SalaryClient<$Result.GetResult<Prisma.$SalaryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Salary that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SalaryFindUniqueOrThrowArgs} args - Arguments to find a Salary
     * @example
     * // Get one Salary
     * const salary = await prisma.salary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SalaryFindUniqueOrThrowArgs>(args: SelectSubset<T, SalaryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SalaryClient<$Result.GetResult<Prisma.$SalaryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Salary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaryFindFirstArgs} args - Arguments to find a Salary
     * @example
     * // Get one Salary
     * const salary = await prisma.salary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SalaryFindFirstArgs>(args?: SelectSubset<T, SalaryFindFirstArgs<ExtArgs>>): Prisma__SalaryClient<$Result.GetResult<Prisma.$SalaryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Salary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaryFindFirstOrThrowArgs} args - Arguments to find a Salary
     * @example
     * // Get one Salary
     * const salary = await prisma.salary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SalaryFindFirstOrThrowArgs>(args?: SelectSubset<T, SalaryFindFirstOrThrowArgs<ExtArgs>>): Prisma__SalaryClient<$Result.GetResult<Prisma.$SalaryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Salaries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Salaries
     * const salaries = await prisma.salary.findMany()
     * 
     * // Get first 10 Salaries
     * const salaries = await prisma.salary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const salaryWithIdOnly = await prisma.salary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SalaryFindManyArgs>(args?: SelectSubset<T, SalaryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalaryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Salary.
     * @param {SalaryCreateArgs} args - Arguments to create a Salary.
     * @example
     * // Create one Salary
     * const Salary = await prisma.salary.create({
     *   data: {
     *     // ... data to create a Salary
     *   }
     * })
     * 
     */
    create<T extends SalaryCreateArgs>(args: SelectSubset<T, SalaryCreateArgs<ExtArgs>>): Prisma__SalaryClient<$Result.GetResult<Prisma.$SalaryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Salaries.
     * @param {SalaryCreateManyArgs} args - Arguments to create many Salaries.
     * @example
     * // Create many Salaries
     * const salary = await prisma.salary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SalaryCreateManyArgs>(args?: SelectSubset<T, SalaryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Salaries and returns the data saved in the database.
     * @param {SalaryCreateManyAndReturnArgs} args - Arguments to create many Salaries.
     * @example
     * // Create many Salaries
     * const salary = await prisma.salary.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Salaries and only return the `id`
     * const salaryWithIdOnly = await prisma.salary.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SalaryCreateManyAndReturnArgs>(args?: SelectSubset<T, SalaryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalaryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Salary.
     * @param {SalaryDeleteArgs} args - Arguments to delete one Salary.
     * @example
     * // Delete one Salary
     * const Salary = await prisma.salary.delete({
     *   where: {
     *     // ... filter to delete one Salary
     *   }
     * })
     * 
     */
    delete<T extends SalaryDeleteArgs>(args: SelectSubset<T, SalaryDeleteArgs<ExtArgs>>): Prisma__SalaryClient<$Result.GetResult<Prisma.$SalaryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Salary.
     * @param {SalaryUpdateArgs} args - Arguments to update one Salary.
     * @example
     * // Update one Salary
     * const salary = await prisma.salary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SalaryUpdateArgs>(args: SelectSubset<T, SalaryUpdateArgs<ExtArgs>>): Prisma__SalaryClient<$Result.GetResult<Prisma.$SalaryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Salaries.
     * @param {SalaryDeleteManyArgs} args - Arguments to filter Salaries to delete.
     * @example
     * // Delete a few Salaries
     * const { count } = await prisma.salary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SalaryDeleteManyArgs>(args?: SelectSubset<T, SalaryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Salaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Salaries
     * const salary = await prisma.salary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SalaryUpdateManyArgs>(args: SelectSubset<T, SalaryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Salary.
     * @param {SalaryUpsertArgs} args - Arguments to update or create a Salary.
     * @example
     * // Update or create a Salary
     * const salary = await prisma.salary.upsert({
     *   create: {
     *     // ... data to create a Salary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Salary we want to update
     *   }
     * })
     */
    upsert<T extends SalaryUpsertArgs>(args: SelectSubset<T, SalaryUpsertArgs<ExtArgs>>): Prisma__SalaryClient<$Result.GetResult<Prisma.$SalaryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Salaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaryCountArgs} args - Arguments to filter Salaries to count.
     * @example
     * // Count the number of Salaries
     * const count = await prisma.salary.count({
     *   where: {
     *     // ... the filter for the Salaries we want to count
     *   }
     * })
    **/
    count<T extends SalaryCountArgs>(
      args?: Subset<T, SalaryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SalaryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Salary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SalaryAggregateArgs>(args: Subset<T, SalaryAggregateArgs>): Prisma.PrismaPromise<GetSalaryAggregateType<T>>

    /**
     * Group by Salary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalaryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SalaryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SalaryGroupByArgs['orderBy'] }
        : { orderBy?: SalaryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SalaryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalaryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Salary model
   */
  readonly fields: SalaryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Salary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SalaryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Salary model
   */ 
  interface SalaryFieldRefs {
    readonly id: FieldRef<"Salary", 'String'>
    readonly userId: FieldRef<"Salary", 'String'>
    readonly basicSalary: FieldRef<"Salary", 'Decimal'>
    readonly allowance: FieldRef<"Salary", 'Decimal'>
    readonly deduction: FieldRef<"Salary", 'Decimal'>
    readonly netSalary: FieldRef<"Salary", 'Decimal'>
    readonly createdAt: FieldRef<"Salary", 'DateTime'>
    readonly updatedAt: FieldRef<"Salary", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Salary findUnique
   */
  export type SalaryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelect<ExtArgs> | null
    /**
     * Filter, which Salary to fetch.
     */
    where: SalaryWhereUniqueInput
  }

  /**
   * Salary findUniqueOrThrow
   */
  export type SalaryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelect<ExtArgs> | null
    /**
     * Filter, which Salary to fetch.
     */
    where: SalaryWhereUniqueInput
  }

  /**
   * Salary findFirst
   */
  export type SalaryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelect<ExtArgs> | null
    /**
     * Filter, which Salary to fetch.
     */
    where?: SalaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salaries to fetch.
     */
    orderBy?: SalaryOrderByWithRelationInput | SalaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Salaries.
     */
    cursor?: SalaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Salaries.
     */
    distinct?: SalaryScalarFieldEnum | SalaryScalarFieldEnum[]
  }

  /**
   * Salary findFirstOrThrow
   */
  export type SalaryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelect<ExtArgs> | null
    /**
     * Filter, which Salary to fetch.
     */
    where?: SalaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salaries to fetch.
     */
    orderBy?: SalaryOrderByWithRelationInput | SalaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Salaries.
     */
    cursor?: SalaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Salaries.
     */
    distinct?: SalaryScalarFieldEnum | SalaryScalarFieldEnum[]
  }

  /**
   * Salary findMany
   */
  export type SalaryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelect<ExtArgs> | null
    /**
     * Filter, which Salaries to fetch.
     */
    where?: SalaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Salaries to fetch.
     */
    orderBy?: SalaryOrderByWithRelationInput | SalaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Salaries.
     */
    cursor?: SalaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Salaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Salaries.
     */
    skip?: number
    distinct?: SalaryScalarFieldEnum | SalaryScalarFieldEnum[]
  }

  /**
   * Salary create
   */
  export type SalaryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelect<ExtArgs> | null
    /**
     * The data needed to create a Salary.
     */
    data: XOR<SalaryCreateInput, SalaryUncheckedCreateInput>
  }

  /**
   * Salary createMany
   */
  export type SalaryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Salaries.
     */
    data: SalaryCreateManyInput | SalaryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Salary createManyAndReturn
   */
  export type SalaryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Salaries.
     */
    data: SalaryCreateManyInput | SalaryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Salary update
   */
  export type SalaryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelect<ExtArgs> | null
    /**
     * The data needed to update a Salary.
     */
    data: XOR<SalaryUpdateInput, SalaryUncheckedUpdateInput>
    /**
     * Choose, which Salary to update.
     */
    where: SalaryWhereUniqueInput
  }

  /**
   * Salary updateMany
   */
  export type SalaryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Salaries.
     */
    data: XOR<SalaryUpdateManyMutationInput, SalaryUncheckedUpdateManyInput>
    /**
     * Filter which Salaries to update
     */
    where?: SalaryWhereInput
  }

  /**
   * Salary upsert
   */
  export type SalaryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelect<ExtArgs> | null
    /**
     * The filter to search for the Salary to update in case it exists.
     */
    where: SalaryWhereUniqueInput
    /**
     * In case the Salary found by the `where` argument doesn't exist, create a new Salary with this data.
     */
    create: XOR<SalaryCreateInput, SalaryUncheckedCreateInput>
    /**
     * In case the Salary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SalaryUpdateInput, SalaryUncheckedUpdateInput>
  }

  /**
   * Salary delete
   */
  export type SalaryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelect<ExtArgs> | null
    /**
     * Filter which Salary to delete.
     */
    where: SalaryWhereUniqueInput
  }

  /**
   * Salary deleteMany
   */
  export type SalaryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Salaries to delete
     */
    where?: SalaryWhereInput
  }

  /**
   * Salary without action
   */
  export type SalaryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Salary
     */
    select?: SalarySelect<ExtArgs> | null
  }


  /**
   * Model PayrollRecord
   */

  export type AggregatePayrollRecord = {
    _count: PayrollRecordCountAggregateOutputType | null
    _avg: PayrollRecordAvgAggregateOutputType | null
    _sum: PayrollRecordSumAggregateOutputType | null
    _min: PayrollRecordMinAggregateOutputType | null
    _max: PayrollRecordMaxAggregateOutputType | null
  }

  export type PayrollRecordAvgAggregateOutputType = {
    basicSalary: Decimal | null
    totalAllowance: Decimal | null
    totalDeduction: Decimal | null
    bpjsDeduction: Decimal | null
    taxDeduction: Decimal | null
    netSalary: Decimal | null
  }

  export type PayrollRecordSumAggregateOutputType = {
    basicSalary: Decimal | null
    totalAllowance: Decimal | null
    totalDeduction: Decimal | null
    bpjsDeduction: Decimal | null
    taxDeduction: Decimal | null
    netSalary: Decimal | null
  }

  export type PayrollRecordMinAggregateOutputType = {
    id: string | null
    userId: string | null
    period: Date | null
    basicSalary: Decimal | null
    totalAllowance: Decimal | null
    totalDeduction: Decimal | null
    bpjsDeduction: Decimal | null
    taxDeduction: Decimal | null
    netSalary: Decimal | null
    status: $Enums.PayrollStatus | null
    paymentDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayrollRecordMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    period: Date | null
    basicSalary: Decimal | null
    totalAllowance: Decimal | null
    totalDeduction: Decimal | null
    bpjsDeduction: Decimal | null
    taxDeduction: Decimal | null
    netSalary: Decimal | null
    status: $Enums.PayrollStatus | null
    paymentDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayrollRecordCountAggregateOutputType = {
    id: number
    userId: number
    period: number
    basicSalary: number
    totalAllowance: number
    totalDeduction: number
    bpjsDeduction: number
    taxDeduction: number
    netSalary: number
    status: number
    paymentDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PayrollRecordAvgAggregateInputType = {
    basicSalary?: true
    totalAllowance?: true
    totalDeduction?: true
    bpjsDeduction?: true
    taxDeduction?: true
    netSalary?: true
  }

  export type PayrollRecordSumAggregateInputType = {
    basicSalary?: true
    totalAllowance?: true
    totalDeduction?: true
    bpjsDeduction?: true
    taxDeduction?: true
    netSalary?: true
  }

  export type PayrollRecordMinAggregateInputType = {
    id?: true
    userId?: true
    period?: true
    basicSalary?: true
    totalAllowance?: true
    totalDeduction?: true
    bpjsDeduction?: true
    taxDeduction?: true
    netSalary?: true
    status?: true
    paymentDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayrollRecordMaxAggregateInputType = {
    id?: true
    userId?: true
    period?: true
    basicSalary?: true
    totalAllowance?: true
    totalDeduction?: true
    bpjsDeduction?: true
    taxDeduction?: true
    netSalary?: true
    status?: true
    paymentDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayrollRecordCountAggregateInputType = {
    id?: true
    userId?: true
    period?: true
    basicSalary?: true
    totalAllowance?: true
    totalDeduction?: true
    bpjsDeduction?: true
    taxDeduction?: true
    netSalary?: true
    status?: true
    paymentDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PayrollRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayrollRecord to aggregate.
     */
    where?: PayrollRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollRecords to fetch.
     */
    orderBy?: PayrollRecordOrderByWithRelationInput | PayrollRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayrollRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PayrollRecords
    **/
    _count?: true | PayrollRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PayrollRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PayrollRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayrollRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayrollRecordMaxAggregateInputType
  }

  export type GetPayrollRecordAggregateType<T extends PayrollRecordAggregateArgs> = {
        [P in keyof T & keyof AggregatePayrollRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayrollRecord[P]>
      : GetScalarType<T[P], AggregatePayrollRecord[P]>
  }




  export type PayrollRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayrollRecordWhereInput
    orderBy?: PayrollRecordOrderByWithAggregationInput | PayrollRecordOrderByWithAggregationInput[]
    by: PayrollRecordScalarFieldEnum[] | PayrollRecordScalarFieldEnum
    having?: PayrollRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayrollRecordCountAggregateInputType | true
    _avg?: PayrollRecordAvgAggregateInputType
    _sum?: PayrollRecordSumAggregateInputType
    _min?: PayrollRecordMinAggregateInputType
    _max?: PayrollRecordMaxAggregateInputType
  }

  export type PayrollRecordGroupByOutputType = {
    id: string
    userId: string
    period: Date
    basicSalary: Decimal
    totalAllowance: Decimal
    totalDeduction: Decimal
    bpjsDeduction: Decimal | null
    taxDeduction: Decimal | null
    netSalary: Decimal
    status: $Enums.PayrollStatus
    paymentDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PayrollRecordCountAggregateOutputType | null
    _avg: PayrollRecordAvgAggregateOutputType | null
    _sum: PayrollRecordSumAggregateOutputType | null
    _min: PayrollRecordMinAggregateOutputType | null
    _max: PayrollRecordMaxAggregateOutputType | null
  }

  type GetPayrollRecordGroupByPayload<T extends PayrollRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayrollRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayrollRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayrollRecordGroupByOutputType[P]>
            : GetScalarType<T[P], PayrollRecordGroupByOutputType[P]>
        }
      >
    >


  export type PayrollRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    period?: boolean
    basicSalary?: boolean
    totalAllowance?: boolean
    totalDeduction?: boolean
    bpjsDeduction?: boolean
    taxDeduction?: boolean
    netSalary?: boolean
    status?: boolean
    paymentDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["payrollRecord"]>

  export type PayrollRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    period?: boolean
    basicSalary?: boolean
    totalAllowance?: boolean
    totalDeduction?: boolean
    bpjsDeduction?: boolean
    taxDeduction?: boolean
    netSalary?: boolean
    status?: boolean
    paymentDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["payrollRecord"]>

  export type PayrollRecordSelectScalar = {
    id?: boolean
    userId?: boolean
    period?: boolean
    basicSalary?: boolean
    totalAllowance?: boolean
    totalDeduction?: boolean
    bpjsDeduction?: boolean
    taxDeduction?: boolean
    netSalary?: boolean
    status?: boolean
    paymentDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $PayrollRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PayrollRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      period: Date
      basicSalary: Prisma.Decimal
      totalAllowance: Prisma.Decimal
      totalDeduction: Prisma.Decimal
      bpjsDeduction: Prisma.Decimal | null
      taxDeduction: Prisma.Decimal | null
      netSalary: Prisma.Decimal
      status: $Enums.PayrollStatus
      paymentDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payrollRecord"]>
    composites: {}
  }

  type PayrollRecordGetPayload<S extends boolean | null | undefined | PayrollRecordDefaultArgs> = $Result.GetResult<Prisma.$PayrollRecordPayload, S>

  type PayrollRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PayrollRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PayrollRecordCountAggregateInputType | true
    }

  export interface PayrollRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PayrollRecord'], meta: { name: 'PayrollRecord' } }
    /**
     * Find zero or one PayrollRecord that matches the filter.
     * @param {PayrollRecordFindUniqueArgs} args - Arguments to find a PayrollRecord
     * @example
     * // Get one PayrollRecord
     * const payrollRecord = await prisma.payrollRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayrollRecordFindUniqueArgs>(args: SelectSubset<T, PayrollRecordFindUniqueArgs<ExtArgs>>): Prisma__PayrollRecordClient<$Result.GetResult<Prisma.$PayrollRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PayrollRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PayrollRecordFindUniqueOrThrowArgs} args - Arguments to find a PayrollRecord
     * @example
     * // Get one PayrollRecord
     * const payrollRecord = await prisma.payrollRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayrollRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, PayrollRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayrollRecordClient<$Result.GetResult<Prisma.$PayrollRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PayrollRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollRecordFindFirstArgs} args - Arguments to find a PayrollRecord
     * @example
     * // Get one PayrollRecord
     * const payrollRecord = await prisma.payrollRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayrollRecordFindFirstArgs>(args?: SelectSubset<T, PayrollRecordFindFirstArgs<ExtArgs>>): Prisma__PayrollRecordClient<$Result.GetResult<Prisma.$PayrollRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PayrollRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollRecordFindFirstOrThrowArgs} args - Arguments to find a PayrollRecord
     * @example
     * // Get one PayrollRecord
     * const payrollRecord = await prisma.payrollRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayrollRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, PayrollRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayrollRecordClient<$Result.GetResult<Prisma.$PayrollRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PayrollRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PayrollRecords
     * const payrollRecords = await prisma.payrollRecord.findMany()
     * 
     * // Get first 10 PayrollRecords
     * const payrollRecords = await prisma.payrollRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payrollRecordWithIdOnly = await prisma.payrollRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayrollRecordFindManyArgs>(args?: SelectSubset<T, PayrollRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayrollRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PayrollRecord.
     * @param {PayrollRecordCreateArgs} args - Arguments to create a PayrollRecord.
     * @example
     * // Create one PayrollRecord
     * const PayrollRecord = await prisma.payrollRecord.create({
     *   data: {
     *     // ... data to create a PayrollRecord
     *   }
     * })
     * 
     */
    create<T extends PayrollRecordCreateArgs>(args: SelectSubset<T, PayrollRecordCreateArgs<ExtArgs>>): Prisma__PayrollRecordClient<$Result.GetResult<Prisma.$PayrollRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PayrollRecords.
     * @param {PayrollRecordCreateManyArgs} args - Arguments to create many PayrollRecords.
     * @example
     * // Create many PayrollRecords
     * const payrollRecord = await prisma.payrollRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayrollRecordCreateManyArgs>(args?: SelectSubset<T, PayrollRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PayrollRecords and returns the data saved in the database.
     * @param {PayrollRecordCreateManyAndReturnArgs} args - Arguments to create many PayrollRecords.
     * @example
     * // Create many PayrollRecords
     * const payrollRecord = await prisma.payrollRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PayrollRecords and only return the `id`
     * const payrollRecordWithIdOnly = await prisma.payrollRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PayrollRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, PayrollRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayrollRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PayrollRecord.
     * @param {PayrollRecordDeleteArgs} args - Arguments to delete one PayrollRecord.
     * @example
     * // Delete one PayrollRecord
     * const PayrollRecord = await prisma.payrollRecord.delete({
     *   where: {
     *     // ... filter to delete one PayrollRecord
     *   }
     * })
     * 
     */
    delete<T extends PayrollRecordDeleteArgs>(args: SelectSubset<T, PayrollRecordDeleteArgs<ExtArgs>>): Prisma__PayrollRecordClient<$Result.GetResult<Prisma.$PayrollRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PayrollRecord.
     * @param {PayrollRecordUpdateArgs} args - Arguments to update one PayrollRecord.
     * @example
     * // Update one PayrollRecord
     * const payrollRecord = await prisma.payrollRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayrollRecordUpdateArgs>(args: SelectSubset<T, PayrollRecordUpdateArgs<ExtArgs>>): Prisma__PayrollRecordClient<$Result.GetResult<Prisma.$PayrollRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PayrollRecords.
     * @param {PayrollRecordDeleteManyArgs} args - Arguments to filter PayrollRecords to delete.
     * @example
     * // Delete a few PayrollRecords
     * const { count } = await prisma.payrollRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayrollRecordDeleteManyArgs>(args?: SelectSubset<T, PayrollRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PayrollRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PayrollRecords
     * const payrollRecord = await prisma.payrollRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayrollRecordUpdateManyArgs>(args: SelectSubset<T, PayrollRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PayrollRecord.
     * @param {PayrollRecordUpsertArgs} args - Arguments to update or create a PayrollRecord.
     * @example
     * // Update or create a PayrollRecord
     * const payrollRecord = await prisma.payrollRecord.upsert({
     *   create: {
     *     // ... data to create a PayrollRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PayrollRecord we want to update
     *   }
     * })
     */
    upsert<T extends PayrollRecordUpsertArgs>(args: SelectSubset<T, PayrollRecordUpsertArgs<ExtArgs>>): Prisma__PayrollRecordClient<$Result.GetResult<Prisma.$PayrollRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PayrollRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollRecordCountArgs} args - Arguments to filter PayrollRecords to count.
     * @example
     * // Count the number of PayrollRecords
     * const count = await prisma.payrollRecord.count({
     *   where: {
     *     // ... the filter for the PayrollRecords we want to count
     *   }
     * })
    **/
    count<T extends PayrollRecordCountArgs>(
      args?: Subset<T, PayrollRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayrollRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PayrollRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayrollRecordAggregateArgs>(args: Subset<T, PayrollRecordAggregateArgs>): Prisma.PrismaPromise<GetPayrollRecordAggregateType<T>>

    /**
     * Group by PayrollRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayrollRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayrollRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayrollRecordGroupByArgs['orderBy'] }
        : { orderBy?: PayrollRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayrollRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayrollRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PayrollRecord model
   */
  readonly fields: PayrollRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PayrollRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayrollRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PayrollRecord model
   */ 
  interface PayrollRecordFieldRefs {
    readonly id: FieldRef<"PayrollRecord", 'String'>
    readonly userId: FieldRef<"PayrollRecord", 'String'>
    readonly period: FieldRef<"PayrollRecord", 'DateTime'>
    readonly basicSalary: FieldRef<"PayrollRecord", 'Decimal'>
    readonly totalAllowance: FieldRef<"PayrollRecord", 'Decimal'>
    readonly totalDeduction: FieldRef<"PayrollRecord", 'Decimal'>
    readonly bpjsDeduction: FieldRef<"PayrollRecord", 'Decimal'>
    readonly taxDeduction: FieldRef<"PayrollRecord", 'Decimal'>
    readonly netSalary: FieldRef<"PayrollRecord", 'Decimal'>
    readonly status: FieldRef<"PayrollRecord", 'PayrollStatus'>
    readonly paymentDate: FieldRef<"PayrollRecord", 'DateTime'>
    readonly createdAt: FieldRef<"PayrollRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"PayrollRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PayrollRecord findUnique
   */
  export type PayrollRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelect<ExtArgs> | null
    /**
     * Filter, which PayrollRecord to fetch.
     */
    where: PayrollRecordWhereUniqueInput
  }

  /**
   * PayrollRecord findUniqueOrThrow
   */
  export type PayrollRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelect<ExtArgs> | null
    /**
     * Filter, which PayrollRecord to fetch.
     */
    where: PayrollRecordWhereUniqueInput
  }

  /**
   * PayrollRecord findFirst
   */
  export type PayrollRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelect<ExtArgs> | null
    /**
     * Filter, which PayrollRecord to fetch.
     */
    where?: PayrollRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollRecords to fetch.
     */
    orderBy?: PayrollRecordOrderByWithRelationInput | PayrollRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayrollRecords.
     */
    cursor?: PayrollRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayrollRecords.
     */
    distinct?: PayrollRecordScalarFieldEnum | PayrollRecordScalarFieldEnum[]
  }

  /**
   * PayrollRecord findFirstOrThrow
   */
  export type PayrollRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelect<ExtArgs> | null
    /**
     * Filter, which PayrollRecord to fetch.
     */
    where?: PayrollRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollRecords to fetch.
     */
    orderBy?: PayrollRecordOrderByWithRelationInput | PayrollRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PayrollRecords.
     */
    cursor?: PayrollRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PayrollRecords.
     */
    distinct?: PayrollRecordScalarFieldEnum | PayrollRecordScalarFieldEnum[]
  }

  /**
   * PayrollRecord findMany
   */
  export type PayrollRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelect<ExtArgs> | null
    /**
     * Filter, which PayrollRecords to fetch.
     */
    where?: PayrollRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PayrollRecords to fetch.
     */
    orderBy?: PayrollRecordOrderByWithRelationInput | PayrollRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PayrollRecords.
     */
    cursor?: PayrollRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PayrollRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PayrollRecords.
     */
    skip?: number
    distinct?: PayrollRecordScalarFieldEnum | PayrollRecordScalarFieldEnum[]
  }

  /**
   * PayrollRecord create
   */
  export type PayrollRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelect<ExtArgs> | null
    /**
     * The data needed to create a PayrollRecord.
     */
    data: XOR<PayrollRecordCreateInput, PayrollRecordUncheckedCreateInput>
  }

  /**
   * PayrollRecord createMany
   */
  export type PayrollRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PayrollRecords.
     */
    data: PayrollRecordCreateManyInput | PayrollRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PayrollRecord createManyAndReturn
   */
  export type PayrollRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PayrollRecords.
     */
    data: PayrollRecordCreateManyInput | PayrollRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PayrollRecord update
   */
  export type PayrollRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelect<ExtArgs> | null
    /**
     * The data needed to update a PayrollRecord.
     */
    data: XOR<PayrollRecordUpdateInput, PayrollRecordUncheckedUpdateInput>
    /**
     * Choose, which PayrollRecord to update.
     */
    where: PayrollRecordWhereUniqueInput
  }

  /**
   * PayrollRecord updateMany
   */
  export type PayrollRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PayrollRecords.
     */
    data: XOR<PayrollRecordUpdateManyMutationInput, PayrollRecordUncheckedUpdateManyInput>
    /**
     * Filter which PayrollRecords to update
     */
    where?: PayrollRecordWhereInput
  }

  /**
   * PayrollRecord upsert
   */
  export type PayrollRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelect<ExtArgs> | null
    /**
     * The filter to search for the PayrollRecord to update in case it exists.
     */
    where: PayrollRecordWhereUniqueInput
    /**
     * In case the PayrollRecord found by the `where` argument doesn't exist, create a new PayrollRecord with this data.
     */
    create: XOR<PayrollRecordCreateInput, PayrollRecordUncheckedCreateInput>
    /**
     * In case the PayrollRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayrollRecordUpdateInput, PayrollRecordUncheckedUpdateInput>
  }

  /**
   * PayrollRecord delete
   */
  export type PayrollRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelect<ExtArgs> | null
    /**
     * Filter which PayrollRecord to delete.
     */
    where: PayrollRecordWhereUniqueInput
  }

  /**
   * PayrollRecord deleteMany
   */
  export type PayrollRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PayrollRecords to delete
     */
    where?: PayrollRecordWhereInput
  }

  /**
   * PayrollRecord without action
   */
  export type PayrollRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayrollRecord
     */
    select?: PayrollRecordSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SalaryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    basicSalary: 'basicSalary',
    allowance: 'allowance',
    deduction: 'deduction',
    netSalary: 'netSalary',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SalaryScalarFieldEnum = (typeof SalaryScalarFieldEnum)[keyof typeof SalaryScalarFieldEnum]


  export const PayrollRecordScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    period: 'period',
    basicSalary: 'basicSalary',
    totalAllowance: 'totalAllowance',
    totalDeduction: 'totalDeduction',
    bpjsDeduction: 'bpjsDeduction',
    taxDeduction: 'taxDeduction',
    netSalary: 'netSalary',
    status: 'status',
    paymentDate: 'paymentDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PayrollRecordScalarFieldEnum = (typeof PayrollRecordScalarFieldEnum)[keyof typeof PayrollRecordScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'PayrollStatus'
   */
  export type EnumPayrollStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayrollStatus'>
    


  /**
   * Reference to a field of type 'PayrollStatus[]'
   */
  export type ListEnumPayrollStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayrollStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type SalaryWhereInput = {
    AND?: SalaryWhereInput | SalaryWhereInput[]
    OR?: SalaryWhereInput[]
    NOT?: SalaryWhereInput | SalaryWhereInput[]
    id?: StringFilter<"Salary"> | string
    userId?: StringFilter<"Salary"> | string
    basicSalary?: DecimalFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    allowance?: DecimalFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    deduction?: DecimalFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    netSalary?: DecimalFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Salary"> | Date | string
    updatedAt?: DateTimeFilter<"Salary"> | Date | string
  }

  export type SalaryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    basicSalary?: SortOrder
    allowance?: SortOrder
    deduction?: SortOrder
    netSalary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalaryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: SalaryWhereInput | SalaryWhereInput[]
    OR?: SalaryWhereInput[]
    NOT?: SalaryWhereInput | SalaryWhereInput[]
    basicSalary?: DecimalFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    allowance?: DecimalFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    deduction?: DecimalFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    netSalary?: DecimalFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Salary"> | Date | string
    updatedAt?: DateTimeFilter<"Salary"> | Date | string
  }, "id" | "userId">

  export type SalaryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    basicSalary?: SortOrder
    allowance?: SortOrder
    deduction?: SortOrder
    netSalary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SalaryCountOrderByAggregateInput
    _avg?: SalaryAvgOrderByAggregateInput
    _max?: SalaryMaxOrderByAggregateInput
    _min?: SalaryMinOrderByAggregateInput
    _sum?: SalarySumOrderByAggregateInput
  }

  export type SalaryScalarWhereWithAggregatesInput = {
    AND?: SalaryScalarWhereWithAggregatesInput | SalaryScalarWhereWithAggregatesInput[]
    OR?: SalaryScalarWhereWithAggregatesInput[]
    NOT?: SalaryScalarWhereWithAggregatesInput | SalaryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Salary"> | string
    userId?: StringWithAggregatesFilter<"Salary"> | string
    basicSalary?: DecimalWithAggregatesFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    allowance?: DecimalWithAggregatesFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    deduction?: DecimalWithAggregatesFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    netSalary?: DecimalWithAggregatesFilter<"Salary"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Salary"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Salary"> | Date | string
  }

  export type PayrollRecordWhereInput = {
    AND?: PayrollRecordWhereInput | PayrollRecordWhereInput[]
    OR?: PayrollRecordWhereInput[]
    NOT?: PayrollRecordWhereInput | PayrollRecordWhereInput[]
    id?: StringFilter<"PayrollRecord"> | string
    userId?: StringFilter<"PayrollRecord"> | string
    period?: DateTimeFilter<"PayrollRecord"> | Date | string
    basicSalary?: DecimalFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    totalAllowance?: DecimalFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    totalDeduction?: DecimalFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    bpjsDeduction?: DecimalNullableFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string | null
    taxDeduction?: DecimalNullableFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string | null
    netSalary?: DecimalFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFilter<"PayrollRecord"> | $Enums.PayrollStatus
    paymentDate?: DateTimeNullableFilter<"PayrollRecord"> | Date | string | null
    createdAt?: DateTimeFilter<"PayrollRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PayrollRecord"> | Date | string
  }

  export type PayrollRecordOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    period?: SortOrder
    basicSalary?: SortOrder
    totalAllowance?: SortOrder
    totalDeduction?: SortOrder
    bpjsDeduction?: SortOrderInput | SortOrder
    taxDeduction?: SortOrderInput | SortOrder
    netSalary?: SortOrder
    status?: SortOrder
    paymentDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayrollRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PayrollRecordWhereInput | PayrollRecordWhereInput[]
    OR?: PayrollRecordWhereInput[]
    NOT?: PayrollRecordWhereInput | PayrollRecordWhereInput[]
    userId?: StringFilter<"PayrollRecord"> | string
    period?: DateTimeFilter<"PayrollRecord"> | Date | string
    basicSalary?: DecimalFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    totalAllowance?: DecimalFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    totalDeduction?: DecimalFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    bpjsDeduction?: DecimalNullableFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string | null
    taxDeduction?: DecimalNullableFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string | null
    netSalary?: DecimalFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFilter<"PayrollRecord"> | $Enums.PayrollStatus
    paymentDate?: DateTimeNullableFilter<"PayrollRecord"> | Date | string | null
    createdAt?: DateTimeFilter<"PayrollRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PayrollRecord"> | Date | string
  }, "id">

  export type PayrollRecordOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    period?: SortOrder
    basicSalary?: SortOrder
    totalAllowance?: SortOrder
    totalDeduction?: SortOrder
    bpjsDeduction?: SortOrderInput | SortOrder
    taxDeduction?: SortOrderInput | SortOrder
    netSalary?: SortOrder
    status?: SortOrder
    paymentDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PayrollRecordCountOrderByAggregateInput
    _avg?: PayrollRecordAvgOrderByAggregateInput
    _max?: PayrollRecordMaxOrderByAggregateInput
    _min?: PayrollRecordMinOrderByAggregateInput
    _sum?: PayrollRecordSumOrderByAggregateInput
  }

  export type PayrollRecordScalarWhereWithAggregatesInput = {
    AND?: PayrollRecordScalarWhereWithAggregatesInput | PayrollRecordScalarWhereWithAggregatesInput[]
    OR?: PayrollRecordScalarWhereWithAggregatesInput[]
    NOT?: PayrollRecordScalarWhereWithAggregatesInput | PayrollRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PayrollRecord"> | string
    userId?: StringWithAggregatesFilter<"PayrollRecord"> | string
    period?: DateTimeWithAggregatesFilter<"PayrollRecord"> | Date | string
    basicSalary?: DecimalWithAggregatesFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    totalAllowance?: DecimalWithAggregatesFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    totalDeduction?: DecimalWithAggregatesFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    bpjsDeduction?: DecimalNullableWithAggregatesFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string | null
    taxDeduction?: DecimalNullableWithAggregatesFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string | null
    netSalary?: DecimalWithAggregatesFilter<"PayrollRecord"> | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusWithAggregatesFilter<"PayrollRecord"> | $Enums.PayrollStatus
    paymentDate?: DateTimeNullableWithAggregatesFilter<"PayrollRecord"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PayrollRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PayrollRecord"> | Date | string
  }

  export type SalaryCreateInput = {
    id?: string
    userId: string
    basicSalary: Decimal | DecimalJsLike | number | string
    allowance?: Decimal | DecimalJsLike | number | string
    deduction?: Decimal | DecimalJsLike | number | string
    netSalary: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalaryUncheckedCreateInput = {
    id?: string
    userId: string
    basicSalary: Decimal | DecimalJsLike | number | string
    allowance?: Decimal | DecimalJsLike | number | string
    deduction?: Decimal | DecimalJsLike | number | string
    netSalary: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalaryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    basicSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deduction?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalaryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    basicSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deduction?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalaryCreateManyInput = {
    id?: string
    userId: string
    basicSalary: Decimal | DecimalJsLike | number | string
    allowance?: Decimal | DecimalJsLike | number | string
    deduction?: Decimal | DecimalJsLike | number | string
    netSalary: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalaryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    basicSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deduction?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalaryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    basicSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    allowance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    deduction?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollRecordCreateInput = {
    id?: string
    userId: string
    period: Date | string
    basicSalary: Decimal | DecimalJsLike | number | string
    totalAllowance: Decimal | DecimalJsLike | number | string
    totalDeduction: Decimal | DecimalJsLike | number | string
    bpjsDeduction?: Decimal | DecimalJsLike | number | string | null
    taxDeduction?: Decimal | DecimalJsLike | number | string | null
    netSalary: Decimal | DecimalJsLike | number | string
    status?: $Enums.PayrollStatus
    paymentDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollRecordUncheckedCreateInput = {
    id?: string
    userId: string
    period: Date | string
    basicSalary: Decimal | DecimalJsLike | number | string
    totalAllowance: Decimal | DecimalJsLike | number | string
    totalDeduction: Decimal | DecimalJsLike | number | string
    bpjsDeduction?: Decimal | DecimalJsLike | number | string | null
    taxDeduction?: Decimal | DecimalJsLike | number | string | null
    netSalary: Decimal | DecimalJsLike | number | string
    status?: $Enums.PayrollStatus
    paymentDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    basicSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAllowance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeduction?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bpjsDeduction?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    taxDeduction?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    netSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    basicSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAllowance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeduction?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bpjsDeduction?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    taxDeduction?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    netSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollRecordCreateManyInput = {
    id?: string
    userId: string
    period: Date | string
    basicSalary: Decimal | DecimalJsLike | number | string
    totalAllowance: Decimal | DecimalJsLike | number | string
    totalDeduction: Decimal | DecimalJsLike | number | string
    bpjsDeduction?: Decimal | DecimalJsLike | number | string | null
    taxDeduction?: Decimal | DecimalJsLike | number | string | null
    netSalary: Decimal | DecimalJsLike | number | string
    status?: $Enums.PayrollStatus
    paymentDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayrollRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    basicSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAllowance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeduction?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bpjsDeduction?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    taxDeduction?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    netSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayrollRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    period?: DateTimeFieldUpdateOperationsInput | Date | string
    basicSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalAllowance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeduction?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    bpjsDeduction?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    taxDeduction?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    netSalary?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPayrollStatusFieldUpdateOperationsInput | $Enums.PayrollStatus
    paymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SalaryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    basicSalary?: SortOrder
    allowance?: SortOrder
    deduction?: SortOrder
    netSalary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalaryAvgOrderByAggregateInput = {
    basicSalary?: SortOrder
    allowance?: SortOrder
    deduction?: SortOrder
    netSalary?: SortOrder
  }

  export type SalaryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    basicSalary?: SortOrder
    allowance?: SortOrder
    deduction?: SortOrder
    netSalary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalaryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    basicSalary?: SortOrder
    allowance?: SortOrder
    deduction?: SortOrder
    netSalary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalarySumOrderByAggregateInput = {
    basicSalary?: SortOrder
    allowance?: SortOrder
    deduction?: SortOrder
    netSalary?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumPayrollStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollStatus | EnumPayrollStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollStatusFilter<$PrismaModel> | $Enums.PayrollStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PayrollRecordCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    period?: SortOrder
    basicSalary?: SortOrder
    totalAllowance?: SortOrder
    totalDeduction?: SortOrder
    bpjsDeduction?: SortOrder
    taxDeduction?: SortOrder
    netSalary?: SortOrder
    status?: SortOrder
    paymentDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayrollRecordAvgOrderByAggregateInput = {
    basicSalary?: SortOrder
    totalAllowance?: SortOrder
    totalDeduction?: SortOrder
    bpjsDeduction?: SortOrder
    taxDeduction?: SortOrder
    netSalary?: SortOrder
  }

  export type PayrollRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    period?: SortOrder
    basicSalary?: SortOrder
    totalAllowance?: SortOrder
    totalDeduction?: SortOrder
    bpjsDeduction?: SortOrder
    taxDeduction?: SortOrder
    netSalary?: SortOrder
    status?: SortOrder
    paymentDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayrollRecordMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    period?: SortOrder
    basicSalary?: SortOrder
    totalAllowance?: SortOrder
    totalDeduction?: SortOrder
    bpjsDeduction?: SortOrder
    taxDeduction?: SortOrder
    netSalary?: SortOrder
    status?: SortOrder
    paymentDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayrollRecordSumOrderByAggregateInput = {
    basicSalary?: SortOrder
    totalAllowance?: SortOrder
    totalDeduction?: SortOrder
    bpjsDeduction?: SortOrder
    taxDeduction?: SortOrder
    netSalary?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumPayrollStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollStatus | EnumPayrollStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollStatusWithAggregatesFilter<$PrismaModel> | $Enums.PayrollStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPayrollStatusFilter<$PrismaModel>
    _max?: NestedEnumPayrollStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumPayrollStatusFieldUpdateOperationsInput = {
    set?: $Enums.PayrollStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumPayrollStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollStatus | EnumPayrollStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollStatusFilter<$PrismaModel> | $Enums.PayrollStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumPayrollStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PayrollStatus | EnumPayrollStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PayrollStatus[] | ListEnumPayrollStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPayrollStatusWithAggregatesFilter<$PrismaModel> | $Enums.PayrollStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPayrollStatusFilter<$PrismaModel>
    _max?: NestedEnumPayrollStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use SalaryDefaultArgs instead
     */
    export type SalaryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SalaryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PayrollRecordDefaultArgs instead
     */
    export type PayrollRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PayrollRecordDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}