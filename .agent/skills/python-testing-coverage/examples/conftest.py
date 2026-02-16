import pytest

@pytest.fixture
def api_client_mock():
    """
    Ejemplo de una fixture de pytest para ser compartida entre múltiples pruebas.
    """
    class MockClient:
        def get_data(self):
            return {"status": "ok", "data": [1, 2, 3]}
    
    return MockClient()
