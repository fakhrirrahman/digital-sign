declare const Temporal: {
  Instant: {
    from(value: string): { epochMilliseconds: number };
    fromEpochMilliseconds(value: number): { epochMilliseconds: number };
  };
};

export const nowInstant = () => Temporal.Instant.fromEpochMilliseconds(Date.now());
export type InstantLike = ReturnType<typeof nowInstant>;

export const toInstant = (value: Date | string | number) => {
  if (typeof value === "number") {
    return Temporal.Instant.fromEpochMilliseconds(value);
  }

  if (value instanceof Date) {
    return Temporal.Instant.from(value.toISOString());
  }

  return Temporal.Instant.from(value);
};

export const instantToEpochMilliseconds = (value: unknown) => {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (
    value
    && typeof value === "object"
    && "epochMilliseconds" in value
    && typeof value.epochMilliseconds === "number"
  ) {
    return value.epochMilliseconds;
  }

  return new Date(String(value)).getTime();
};
