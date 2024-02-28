package device.management.dto.validator.annotation;

import device.management.dto.validator.FieldLengthValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = {FieldLengthValidator.class})
public @interface FieldLengthLimit {

    int limit() default 4;

    String message() default "Address/Description is too short";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
