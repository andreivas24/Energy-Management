package user.management.dto.validator;

import org.springframework.stereotype.Component;
import user.management.dto.validator.annotation.FieldLengthLimit;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
public class FieldLengthValidator implements ConstraintValidator<FieldLengthLimit, String> {
    private int lengthLimit;

    @Override
    public void initialize(FieldLengthLimit constraintAnnotation) {
        this.lengthLimit = constraintAnnotation.limit();
    }

    @Override
    public boolean isValid(String name, ConstraintValidatorContext constraintValidatorContext) {
        return name.length() >= lengthLimit;
    }
}
