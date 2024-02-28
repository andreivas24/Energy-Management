package user.management.dto.validator.annotation;

import user.management.dto.validator.FieldLengthValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = {FieldLengthValidator.class})
public @interface FieldLengthLimit {

    int limit() default 4;

    String message() default "Username/Password is too short";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
