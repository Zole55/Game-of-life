var app = angular.module('GOLApp', []);

app.directive('onReadFile', function($parse) {
  return {
    restrict: 'A',
    scope: {
      onReadFile: "&"
    },
    link: function(scope, element, attrs) {
      element.on('change', function(e) {
        var reader = new FileReader();
        reader.onload = function(e) {
          scope.$apply(function() {
            scope.onReadFile({
              $content: e.target.result
            });
          });
        };
        reader.readAsText((e.srcElement || e.target).files[0]);
      });
    }

  };
});

app.controller('Ctrl', function($scope, $interval) {
  szam1 = 0;
  szam2 = 0;
  end = 0, k1 = 0, k2 = 0;
  $scope.generation = 0;
  var rowm = 41;
  var colm = 41;
  var interval;
  $scope.rows = [];
  for (var i = 0; i < rowm; i++) {
    var col = [];
    for (var j = 0; j < colm; j++) {
      col.push({
        'active': 0
      });
    }
    $scope.rows.push({
      'cols': col
    });
  }

  for (var i = 0; i < rowm; i++) {
    for (var j = 0; j < colm; j++) {
      $scope.rows[i].cols[j].active = 0;
    }
  }

  // Arra szolgál, hogy ha kattintok a táblán, akkor változzon a mező státusza
  function ActiveK() {
    $scope.activate = function(row, col) {
      if ($scope.rows[row].cols[col].active == 0 || $scope.rows[row].cols[col].active == 2) {
        $scope.rows[row].cols[col].active = 1;
      } else {
        $scope.rows[row].cols[col].active = 0;
      }

    }
  }
  ActiveK();

  //Szomszéd vizsgálat--------------------------------
  function checkNeighbours(row, col) {
    var count = 0;
    for (var i = row - 1; i <= row + 1; i++) {
      for (var j = col - 1; j <= col + 1; j++) {
        if ((i != row || j != col) && ($scope.rows[i]) && ($scope.rows[i].cols[j])) {
          if ($scope.rows[i].cols[j].active == 1) {
            count++;
          }
        }
      }
    }
    return count;
  }
  //--------------------------------------------------
  // Vége ellenőrzések--------------------------------
  function checkEnd() {
    var temp = 0;
    for (var i = 0; i < rowm; i++) {
      for (var j = 0; j < colm; j++) {
        if ($scope.rows[i].cols[j].active == 1 //||
          //$scope.rows[i].cols[j].active == 2
        )
          temp++;
      }
    }

    if (temp == 0) {
      $scope.message = "Vége a játéknak! Generációk száma:" + $scope.generation;
      $scope.generation = 0;
      $interval.cancel(interval);
      for (var i = 0; i < rowm; i++) {
        for (var j = 0; j < colm; j++) {
          $scope.rows[i].cols[j].active = 0;
        }
      }
    } else {
      step();
    }

    return temp;
  }
  //-------------------------------------------------

  var pre = new Array(1000);
  for (i = 0; i < pre.length; i++) {
    pre[i] = new Array(41);
  }

  for (i = 0; i < pre.length; i++) {
    for (j = 0; j < pre[i].length; j++) {
      pre[i][j] = new Array(41);
    }
  }

  function step() {
    $scope.generation++;

    for (var i = 0; i < rowm; i++) {
      for (var j = 0; j < colm; j++) {
        pre[$scope.generation][i][j] = $scope.rows[i].cols[j].active;
        $scope.rows[i].cols[j].neighbours = checkNeighbours(i, j);
        if ($scope.rows[i].cols[j].active == 2) {
          $scope.rows[i].cols[j].active = 0;
        }
      }
    }

    for (var i = 0; i < rowm; i++) {
      for (var j = 0; j < colm; j++) {

        if ($scope.rows[i].cols[j].active == 1) {
          if ($scope.rows[i].cols[j].neighbours < 2 || $scope.rows[i].cols[j].neighbours > 3) {
            $scope.rows[i].cols[j].active = 2;
          }
        }

        if ($scope.rows[i].cols[j].neighbours == 3 // && $scope.rows[i].cols[j].active==2
        ) {
          $scope.rows[i].cols[j].active = 1;
        }

      }
    }
  }

  ////////FŐVEZÉRLŐk------------------------------------------------------------------
  //ELŐZŐ
  $scope.eloz = function(ertek) {
    if ($scope.generation > 0) {
      for (var i = 0; i < rowm; i++) {
        for (var j = 0; j < colm; j++) {
          $scope.rows[i].cols[j].active = pre[$scope.generation][i][j];
        }
      }
      $scope.generation--;

    }
  }
  //--
  //Stop
  $scope.stopGame = function() {
    $interval.cancel(interval);
  }
  //--
  //start
  $scope.startGame = function() {

    interval = $interval(function() {
      $scope.message = "";
      end = 0;
      end = checkEnd();
    /*  gen=$scope.generation;
      checkEndV(end,gen);*/
  /*    if (end == 0) {
        $interval.cancel(interval);
        $scope.message = "Vége a játéknak! Generációk száma:" + $scope.generation;
        $scope.generation = 0;
      } else {
        step();
      }*/

      if (end>0) {
        stopGame();
      }

    }, 300);
  }
  //--
  //KÖVETKEZŐ
  $scope.next = function() {
    //    ertek = 1;
    $scope.message = '';
    end = 0;
    end = checkEnd();
    /*gen=$scope.generation;
    checkEndV(end,gen);*/
    //if (ertek == 1) {
    /*  if (end == 0) {
        $scope.message = "Vége a játéknak! Generációk száma:" + $scope.generation;
        $scope.generation = 0;
      } else {
        step();
      }*/
    //    ertek++;
    //    }

  }
  //--
  ////////----------------------------------------------------------------------------








  $scope.showContent = function($content) {
    var v1 = $content.split("#P");

    $scope.generation = 0;
    /*
        //Elozo tomb
        var pre = new Array(1000);
        for (i = 0; i < pre.length; i++) {
          pre[i] = new Array(41);
        }

        for (i = 0; i < pre.length; i++) {
          for (j = 0; j <pre[i].length; j++) {
            pre[i][j] = new Array(41);
          }
        }
    */
    for (var i = 0; i < rowm; i++) {
      for (var j = 0; j < colm; j++) {
        $scope.rows[i].cols[j].active = 0;
      }
    }
    //MINTA FELDOLGOZAS
    $scope.message = "";
    for (var i = 1; i < v1.length; i++) {
      v2 = v1[i].split('\n');
      temp = v2[0].split(' ');
      szam1 = temp[1];
      szam2 = temp[2];

      if ((Math.abs(szam1) < ((rowm - 1) / 2)) && (Math.abs(szam2) < ((rowm - 1) / 2))) {

        if ((rowm / 2) > szam1 && (colm / 2) > szam2) {
          k2 = (((colm - 1) / 2) - szam2);
          k1 = (+((rowm - 1) / 2) + +szam1);
        }

        if ((rowm / 2) < szam1 && (colm / 2) < szam2) {
          k2 = (((colm - 1) / 2) - szam2) * -1;
          k1 = (+((rowm - 1) / 2) + +szam1) * -1;
        }

        if ((rowm / 2) > szam1 && (colm / 2) < szam2) {
          k2 = (((colm - 1) / 2) - szam2) * -1;
          k1 = (+((rowm - 1) / 2) + +szam1);
        }

        if ((rowm / 2) < szam1 && (colm / 2) > szam2) {
          k2 = (((colm - 1) / 2) - szam2);
          k1 = (+((rowm - 1) / 2) + +szam1) * -1;
        }

        for (var j = 1; j < v2.length; j++) {

          var temp = k1;
          for (var k = 0; k < v2[j].length; k++) {

            if (k2 < rowm && temp < rowm) {

              if (v2[j][k] == '*') {
                $scope.rows[k2].cols[temp].active = 1;
              }
              if (v2[j][k] == '.') {
                $scope.rows[k2].cols[temp].active = 2;
              }
              temp++;
            }
          }
          k2++;
        }

      }

    }

    for (var i = 0; i < rowm; i++) {
      for (var j = 0; j < colm; j++) {
        pre[0][i][j] = $scope.rows[i].cols[j].active;
      }
    }

    /*function checkNeighbours(row, col) {
       var count = 0;
       for (var i = row - 1; i <= row + 1; i++) {
         for (var j = col - 1; j <= col + 1; j++) {
           if ((i != row || j != col) && ($scope.rows[i]) && ($scope.rows[i].cols[j])) {
             if ($scope.rows[i].cols[j].active == 1) {
               count++;
             }
           }
         }
       }
       return count;
     }
     */
    /*
         function checkEnd() {
          var temp = 0;
          for (var i = 0; i < rowm; i++) {
            for (var j = 0; j < colm; j++) {
              if ($scope.rows[i].cols[j].active ==1 || $scope.rows[i].cols[j].active ==2 )
                temp++;
            }
          }
          return temp;
        }
    */
    /*
        function step() {
          $scope.generation++;

          for (var i = 0; i < rowm; i++) {
            for (var j = 0; j < colm; j++) {
              pre[$scope.generation][i][j] = $scope.rows[i].cols[j].active;
              $scope.rows[i].cols[j].neighbours = checkNeighbours(i, j);
              if ($scope.rows[i].cols[j].active==2) {
                $scope.rows[i].cols[j].active=0;
              }
            }
          }

          for (var i = 0; i < rowm; i++) {
            for (var j = 0; j < colm; j++) {

              if ($scope.rows[i].cols[j].active == 1) {
                if ($scope.rows[i].cols[j].neighbours < 2 || $scope.rows[i].cols[j].neighbours > 3) {
                  $scope.rows[i].cols[j].active = 2;
                }
              }

              if ($scope.rows[i].cols[j].neighbours == 3// && $scope.rows[i].cols[j].active==2
               ) {
                  $scope.rows[i].cols[j].active = 1;
                }

            }
          }
        }*/


    /*
        function checkEndV(end ){
          if (end == 0) {
             $scope.message = "Vége a játéknak! Generációk száma:" + $scope.generation;
             $scope.generation = 0;
           } else {
             step();
           }
        }*/
    /*
        $scope.startGame = function() {

          interval = $interval(function() {
            end = 0;
            end = checkEnd();
            //checkEndV(end);
            if (end == 0) {
              $interval.cancel(interval);
              $scope.message = "Vége a játéknak! Generációk száma:" + $scope.generation;
              $scope.generation = 0;
            } else {
              step();
            }
          }, 300);
        }

        $scope.stopGame = function() {
          $interval.cancel(interval);
        }
    */


    //  $scope.next = function() {
    //    ertek = 1;
    //    end = 0;
    //    end = checkEnd();
    //    checkEndV(end);
    //if (ertek == 1) {
    /*  if (end == 0) {
        $scope.message = "Vége a játéknak! Generációk száma:" + $scope.generation;
        $scope.generation = 0;
      } else {
        step();
      }*/
    //    ertek++;
    //    }

    /*

        $scope.eloz = function(ertek) {
          if ($scope.generation > 0) {
            for (var i = 0; i < rowm; i++) {
              for (var j = 0; j < colm; j++) {
                $scope.rows[i].cols[j].active = pre[$scope.generation][i][j];
              }
            }
            $scope.generation--;

          }
        }*/


    /*    $scope.activate = function(row, col) {
          if ($scope.rows[row].cols[col].active == 0 || $scope.rows[row].cols[col].active == 2) {
            $scope.rows[row].cols[col].active =1;
          }else {
            $scope.rows[row].cols[col].active =0;
          }

        }*/


  }
});
