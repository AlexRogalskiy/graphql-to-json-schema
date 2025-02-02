import {
  IntrospectionEnumType,
  IntrospectionField,
  IntrospectionInputObjectType,
  IntrospectionInterfaceType,
  IntrospectionInputTypeRef,
  IntrospectionInputValue,
  IntrospectionListTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionNonNullTypeRef,
  IntrospectionObjectType,
  IntrospectionOutputTypeRef,
  IntrospectionSchema,
  IntrospectionType,
  IntrospectionTypeRef,
  IntrospectionUnionType,
  IntrospectionScalarType,
} from 'graphql'
import { filter, has, startsWith, includes } from 'lodash'

///////////////////
/// Type guards ///
///////////////////

export const isIntrospectionField = (
  type: IntrospectionField | IntrospectionInputValue
): type is IntrospectionField => has(type, 'args')

export const isIntrospectionInputValue = (
  type: IntrospectionField | IntrospectionInputValue
): type is IntrospectionInputValue => has(type, 'defaultValue')

// @ts-ignore
export const isIntrospectionListTypeRef = (
  type:
    | IntrospectionTypeRef
    | IntrospectionInputTypeRef
    | IntrospectionOutputTypeRef
): type is IntrospectionListTypeRef => type.kind === 'LIST'

export const isIntrospectionObjectType = (
  type: IntrospectionSchema['types'][0]
): type is IntrospectionObjectType => type.kind === 'OBJECT'

export const isIntrospectionInputObjectType = (
  type: IntrospectionSchema['types'][0]
): type is IntrospectionInputObjectType => type.kind === 'INPUT_OBJECT'

export const isIntrospectionInterfaceType = (
  type: IntrospectionSchema['types'][0]
): type is IntrospectionInterfaceType => type.kind === 'INTERFACE'

export const isIntrospectionEnumType = (
  type: IntrospectionSchema['types'][0]
): type is IntrospectionEnumType => type.kind === 'ENUM'

export const isIntrospectionUnionType = (
  type: IntrospectionSchema['types'][0]
): type is IntrospectionUnionType => type.kind === 'UNION'

export const isNonNullIntrospectionType = (
  type: IntrospectionTypeRef
): type is IntrospectionNonNullTypeRef<
  IntrospectionNamedTypeRef<IntrospectionType>
> => type.kind === 'NON_NULL'
export const isIntrospectionScalarType = (
  type: IntrospectionSchema['types'][0]
): type is IntrospectionScalarType => type.kind === 'SCALAR'

export const isIntrospectionDefaultScalarType = (
  type: IntrospectionSchema['types'][0]
): type is IntrospectionScalarType =>
  type.kind === 'SCALAR' &&
  includes(['Boolean', 'String', 'Int', 'Float'], type.name)

// Ignore all GraphQL native Scalars, directives, etc...
export interface FilterDefinitionsTypesOptions {
  ignoreInternals?: boolean
}
export const filterDefinitionsTypes = (
  types: IntrospectionType[],
  opts?: FilterDefinitionsTypesOptions
): IntrospectionType[] => {
  const ignoreInternals = opts && opts.ignoreInternals
  return filter(
    types,
    (type) =>
      ((isIntrospectionObjectType(type) && !!type.fields) ||
        (isIntrospectionInputObjectType(type) && !!type.inputFields) ||
        (isIntrospectionInterfaceType(type) && !!type.fields) ||
        (isIntrospectionEnumType(type) && !!type.enumValues) ||
        (isIntrospectionUnionType(type) && !!type.possibleTypes) ||
        (isIntrospectionScalarType(type) && !!type.name)) &&
      (!ignoreInternals || (ignoreInternals && !startsWith(type.name, '__')))
  )
}
