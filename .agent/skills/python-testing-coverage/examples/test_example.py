import pytest

def suma(a, b):
    return a + b

def test_suma_basica():
    assert suma(1, 2) == 3

@pytest.mark.parametrize("a, b, esperado", [
    (10, 5, 15),
    (-1, 1, 0),
    (0, 0, 0)
])
def test_suma_parametrizada(a, b, esperado):
    assert suma(a, b) == esperado
