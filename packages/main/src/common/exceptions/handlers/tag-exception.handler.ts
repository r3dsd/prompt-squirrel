import { Effect } from 'effect';
import { ServiceException } from '../base/service.exception.js';
import { DATABASE_EXCEPTION_TAG, DatabaseException } from '../database.exception.js';
import { TagConflictException } from '../tag/tag-confilict.exception.js';
import { UnexpectedException } from '../unexpected.exception.js';

export function TagDatabaseExceptionHandler<T>(
    effect: Effect.Effect<T, DatabaseException>,
): Effect.Effect<T, ServiceException> {
    return effect.pipe(
        Effect.catchTag(DATABASE_EXCEPTION_TAG, (error: DatabaseException) =>
            Effect.gen(function* () {
                if (error.code === 'UNIQUE_VIOLATION')
                    yield* Effect.fail(TagConflictException.from(error));

                return yield* Effect.fail(UnexpectedException.from(error));
            }),
        ),
    );
}
